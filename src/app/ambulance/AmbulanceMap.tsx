// AmbulanceMap.tsx

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Hospital {
  id: string;
  name: string;
  coords: Coordinates;
  availability: number;
}

interface RouteData {
  id: string;
  ambulanceLocation: Coordinates;
  bestHospitalId: string;
  bestHospital: Hospital;
  routeCoordinates: Coordinates[];
  createdAt: string;
}

const MapComponent = dynamic<{
  route: RouteData;
  isSimulationStarted: boolean;
}>(() => import("./MapComponent"), {
  ssr: false,
});

export default function AmbulanceMap() {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  const runAlgorithm = async () => {
    setIsCalculating(true);
    setIsCalculated(false);
    try {
      const response = await fetch("/api/ambulance/runAlgorithm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: 12.9716, // Sample ambulance location
          longitude: 77.5946,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCalculated(true);
        alert("Algorithm run successfully.");
      } else {
        alert("Error running algorithm: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error running algorithm:", error);
      alert("Error running algorithm. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const fetchRoute = async () => {
    setIsFetchingRoute(true);
    try {
      const response = await fetch("/api/ambulance/getRoute");
      const data = await response.json();

      if (response.ok) {
        setRoute(data);
      } else {
        alert("Error fetching route: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Error fetching route. Please try again.");
    } finally {
      setIsFetchingRoute(false);
    }
  };

  useEffect(() => {
    if (isCalculated) {
      fetchRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculated]);

  return (
    <div className="bg-white text-black p-4 min-h-screen border border-black">
      {!isCalculated ? (
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded mb-4 ${
            isCalculating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          onClick={runAlgorithm}
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Run Algorithm"}
        </button>
      ) : (
        <>
          {isFetchingRoute ? (
            <div className="flex items-center justify-center mt-4">
              <div className="spinner mr-2"></div>
              <p className="text-gray-600">Fetching route data...</p>
            </div>
          ) : !route ? (
            <div className="flex items-center justify-center mt-4">
              <div className="spinner mr-2"></div>
              <p className="text-gray-600">Loading route data...</p>
            </div>
          ) : (
            <div className="mt-4">
              {!isSimulationStarted && (
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded mb-4 ${
                    isSimulationStarted
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                  onClick={() => setIsSimulationStarted(true)}
                  disabled={isSimulationStarted}
                >
                  Start Simulation
                </button>
              )}
              <MapComponent
                route={route}
                isSimulationStarted={isSimulationStarted}
              />
            </div>
          )}
        </>
      )}
      {/* Spinner Styles */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border-left-color: #09f;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
