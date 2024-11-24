// src/app/ambulance/MapComponent.tsx

"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteData, Signal } from "./types";

interface MapComponentProps {
  route: RouteData;
  isSimulationStarted: boolean;
}

export default function MapComponent({
  route,
  isSimulationStarted,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const signalsRef = useRef<Signal[]>([]);
  const signalMarkersRef = useRef<{ [key: number]: L.Marker }>({});
  const signalsProcessedRef = useRef<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!route) return;

    const { ambulanceLocation, bestHospital, routeCoordinates } = route;

    // Initialize map if not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        [ambulanceLocation.latitude, ambulanceLocation.longitude],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Update or add ambulance marker
    if (!ambulanceMarkerRef.current) {
      const ambulanceIcon = L.icon({
        iconUrl: "/images/ambulance.png",
        iconSize: [60, 60],
        iconAnchor: [30, 60],
      });

      ambulanceMarkerRef.current = L.marker(
        [ambulanceLocation.latitude, ambulanceLocation.longitude],
        { icon: ambulanceIcon }
      )
        .addTo(map!)
        .bindPopup("Ambulance Starting Location");
    } else {
      ambulanceMarkerRef.current.setLatLng([
        ambulanceLocation.latitude,
        ambulanceLocation.longitude,
      ]);
    }

    // Add best hospital marker
    const hospitalIcon = L.icon({
      iconUrl: "/images/hospital.png",
      iconSize: [60, 60],
      iconAnchor: [30, 60],
    });

    L.marker([bestHospital.coords.latitude, bestHospital.coords.longitude], {
      icon: hospitalIcon,
    })
      .addTo(map!)
      .bindPopup(`Best Hospital: ${bestHospital.name}`);

    // Update or add route polyline
    const latLngs = routeCoordinates.map((coord) => [
      coord.latitude,
      coord.longitude,
    ]) as [number, number][];

    if (!routePolylineRef.current) {
      routePolylineRef.current = L.polyline(latLngs, { color: "black" }).addTo(
        map!
      );
    } else {
      routePolylineRef.current.setLatLngs(latLngs);
    }

    // Fit map to route bounds
    map!.fitBounds(latLngs);

    // Define signal points
    if (routeCoordinates.length > 2) {
      const signalPoints = [
        routeCoordinates[Math.floor(routeCoordinates.length / 3)],
        routeCoordinates[Math.floor((2 * routeCoordinates.length) / 3)],
      ];

      const initialSignals: Signal[] = signalPoints.map((point, idx) => ({
        index: idx, // Ensure index is a number starting from 0
        latitude: point.latitude,
        longitude: point.longitude,
        status: "red",
      }));

      signalsRef.current = initialSignals;

      // Initialize signals in the database
      const initializeSignals = async () => {
        try {
          await fetch("/api/signals/init", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(initialSignals),
          });
        } catch (error) {
          console.error("Error initializing signals:", error);
        }

        // Create markers
        const markers: { [key: number]: L.Marker } = {};
        const processed: { [key: number]: boolean } = {};

        initialSignals.forEach((signal) => {
          const signalIcon = L.icon({
            iconUrl: "/images/red_signal.png",
            iconSize: [35, 35],
            iconAnchor: [17.5, 17.5],
          });

          const marker = L.marker([signal.latitude, signal.longitude], {
            icon: signalIcon,
          })
            .addTo(map!)
            .bindPopup(`Traffic Signal ${signal.index + 1}`);

          markers[signal.index] = marker;
          processed[signal.index] = false; // Mark as not yet processed
        });

        signalMarkersRef.current = markers;
        signalsProcessedRef.current = processed;
      };

      initializeSignals();
    }

    // Cleanup function
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [route]);

  // Function to send a traffic signal request
  const sendTrafficSignalRequest = async (signalIndex: number) => {
    try {
      await fetch("/api/signals/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signalIndex }),
      });
      alert(
        `Request sent to Traffic Police for Signal ${
          signalIndex + 1
        }. Waiting for approval.`
      );
    } catch (error) {
      console.error("Error sending signal request:", error);
    }
  };

  // Start simulation when isSimulationStarted becomes true
  useEffect(() => {
    if (
      isSimulationStarted &&
      route &&
      route.routeCoordinates.length > 0 &&
      ambulanceMarkerRef.current
    ) {
      let index = 0;
      let isPaused = false;

      const moveAmbulance = async () => {
        if (index >= route.routeCoordinates.length) {
          clearInterval(simulationIntervalRef.current!);
          ambulanceMarkerRef
            .current!.bindPopup("Ambulance has arrived!")
            .openPopup();
          return;
        }

        if (isPaused) {
          return;
        }

        const { latitude, longitude } = route.routeCoordinates[index];
        ambulanceMarkerRef.current!.setLatLng([latitude, longitude]);

        // Check if ambulance has reached a signal
        for (const signal of signalsRef.current) {
          if (
            !signalsProcessedRef.current[signal.index] && // Only process each signal once
            Math.abs(signal.latitude - latitude) < 0.0001 &&
            Math.abs(signal.longitude - longitude) < 0.0001
          ) {
            // Pause simulation
            isPaused = true;

            // Mark this signal as processed
            signalsProcessedRef.current[signal.index] = true;

            // Send request to police
            await sendTrafficSignalRequest(signal.index);

            // Poll for signal status
            const checkSignalStatus = async () => {
              try {
                const response = await fetch(
                  `/api/signals/status?signalIndex=${signal.index}`
                );
                const data = await response.json();
                if (data.status === "green") {
                  // Update signal marker to green
                  const signalIcon = L.icon({
                    iconUrl: "/images/green_signal.png",
                    iconSize: [35, 35],
                    iconAnchor: [17.5, 17.5],
                  });

                  // Update marker icon
                  const marker = signalMarkersRef.current[signal.index];
                  if (marker) {
                    marker.setIcon(signalIcon);
                  }

                  // Resume simulation
                  isPaused = false;
                  // Move to next coordinate
                  index++;
                } else {
                  // Wait and check again
                  setTimeout(checkSignalStatus, 1000);
                }
              } catch (error) {
                console.error("Error checking signal status:", error);
              }
            };

            checkSignalStatus();
            return; // Exit the function to prevent index increment
          }
        }

        index++;
      };

      simulationIntervalRef.current = setInterval(moveAmbulance, 500);

      return () => {
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
        }
      };
    }
  }, [isSimulationStarted, route]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}
