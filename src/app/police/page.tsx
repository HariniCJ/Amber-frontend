// app/police/page.tsx

"use client";

import { useEffect, useState } from "react";

interface SignalRequest {
  id: string;
  signalId: string;
  status: string;
  createdAt: string;
  signal: {
    index: number;
    latitude: number;
    longitude: number;
    status: string;
  };
}

export default function PolicePage() {
  const [requests, setRequests] = useState<SignalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Polling interval in milliseconds (e.g., 3000ms = 3 seconds)
  const POLLING_INTERVAL = 3000;

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/police/requests");
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        setError(
          data.error || "Unknown error occurred while fetching requests."
        );
        console.error("Error fetching requests:", data.error);
      }
    } catch (err) {
      setError("Failed to fetch requests. Please try again later.");
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const response = await fetch("/api/police/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Signal request accepted.`);
        // Remove the accepted request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        alert(`Error accepting request: ${data.error || "Unknown error"}`);
        console.error("Error accepting request:", data.error);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Error accepting request. Please try again.");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRequests();

    // Set up polling
    const interval = setInterval(() => {
      fetchRequests();
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 mt-16 border-t border-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">
        Police Control Center
      </h1>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading requests...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Ambulance ID
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Signal Number
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Current Signal Status
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Request Time
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200">
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {request.signalId}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {request.signal.index + 1}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {request.signal.status.charAt(0).toUpperCase() +
                      request.signal.status.slice(1)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    {new Date(request.createdAt).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-800">
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                      onClick={() => acceptRequest(request.id)}
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
