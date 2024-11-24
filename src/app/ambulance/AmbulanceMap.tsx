// src/app/ambulance/ambulancemap.tsx

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RouteData, HospitalAvailability, BestHospital } from "./types";

const MapComponent = dynamic<{
  route: RouteData;
  isSimulationStarted: boolean;
}>(() => import("./MapComponent"), {
  ssr: false,
});

export default function AmbulanceMap() {
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalAvailability[]>([]);
  const [bestHospital, setBestHospital] = useState<BestHospital | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const runAlgorithm = async () => {
    if (latitude === "" || longitude === "") {
      alert("Please enter valid coordinates.");
      return;
    }

    setIsCalculating(true);
    setIsCalculated(false);
    setHospitals([]); // Reset hospitals data
    setRoute(null); // Reset route data
    setBestHospital(null); // Reset best hospital
    setLocationError(null); // Reset location error

    try {
      const response = await fetch("/api/ambulance/runAlgorithm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: Number(latitude),
          longitude: Number(longitude),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsCalculated(true);
        setHospitals(data.hospitals); // Set hospitals data
        setBestHospital(data.bestHospital); // Set best hospital
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

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLatitude(lat);
        setLongitude(lon);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setLocationError("Unable to retrieve your location.");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="bg-white text-black p-4 min-h-screen border border-black flex flex-col md:flex-row">
      {/* Sidebar: Inputs and Hospital Availability */}
      <div className="md:w-1/3 lg:w-1/4 p-4 overflow-y-auto">
        {/* Input Fields */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Enter Latitude:</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Latitude"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Enter Longitude:</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Longitude"
          />
        </div>

        {/* Use Live Location Button */}
        <div className="mb-4">
          <button
            onClick={handleUseLiveLocation}
            className={`w-full px-4 py-2 rounded ${
              isLocating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-black`}
            disabled={isLocating}
          >
            {isLocating ? "Locating..." : "Use Live Location"}
          </button>
          {locationError && (
            <p className="text-red-500 text-sm mt-2">{locationError}</p>
          )}
        </div>

        {/* Run Algorithm Button */}
        {!isCalculated ? (
          <button
            className={`bg-black text-white px-4 py-2 rounded mb-4 w-full ${
              isCalculating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-black`}
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
                    className={`bg-black text-white px-4 py-2 rounded mb-4 w-full ${
                      isSimulationStarted
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-black`}
                    onClick={() => setIsSimulationStarted(true)}
                    disabled={isSimulationStarted}
                  >
                    Start Simulation
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Hospital Availability Table */}
        {hospitals.length > 0 && bestHospital && (
          <div className="mt-4 p-2 border rounded max-h-60 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">
              Hospital Bed Availability
            </h2>
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Hospital Name</th>
                  <th className="px-4 py-2 border">Beds Available</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr
                    key={hospital.id}
                    className={`text-center ${
                      hospital.id === bestHospital.id ? "bg-yellow-100" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border">{hospital.name}</td>
                    <td className="px-4 py-2 border">
                      {hospital.availability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Content: Map */}
      <div className="md:w-2/3 lg:w-3/4 p-4">
        {isCalculated && route ? (
          <MapComponent
            route={route}
            isSimulationStarted={isSimulationStarted}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">
              Enter coordinates and run the algorithm to see the map.
            </p>
          </div>
        )}
      </div>

      {/* Spinner Styles */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border-left-color: #000;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        table th,
        table td {
          border: 1px solid #ddd;
        }

        table th {
          background-color: #f2f2f2;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .md\\:w-1\\/3 {
            width: 100%;
          }
          .md\\:w-2\\/3 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
