// app/doctors/page.tsx

"use client";

import { useState, useEffect } from "react";

interface Emergency {
  id: string;
  condition: string;
  injuryType: string;
  severity: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
  };
  createdAt: string;
}

export default function DoctorsPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)
  const POLLING_INTERVAL = 5000;

  const fetchEmergencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/emergencies");
      const data = await response.json();

      if (response.ok) {
        setEmergencies(data);
      } else {
        setError(
          data.error || "Unknown error occurred while fetching emergencies."
        );
        console.error("Error fetching emergencies:", data.error);
      }
    } catch (err) {
      setError("Failed to fetch emergencies. Please try again later.");
      console.error("Error fetching emergencies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEmergencies();

    // Set up polling
    const interval = setInterval(() => {
      fetchEmergencies();
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 mt-16 border-t border-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        Doctors Emergency Dashboard
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading emergencies...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : emergencies.length === 0 ? (
        <p className="text-center text-gray-600">
          No emergencies reported yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Condition
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Injury Type
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Severity
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Heart Rate (bpm)
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Blood Pressure
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Temperature (°C)
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Reported At
                </th>
              </tr>
            </thead>
            <tbody>
              {emergencies.map((emergency) => (
                <tr key={emergency.id} className="border-b border-gray-200">
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.condition}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.injuryType}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.severity}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.vitals.heartRate}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.vitals.bloodPressure}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {emergency.vitals.temperature}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {new Date(emergency.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Optional: Add pagination or filtering here */}
    </div>
  );
}
