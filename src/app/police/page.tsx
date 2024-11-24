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

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/police/requests");
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        console.error("Error fetching requests:", data.error);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await fetch("/api/police/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      alert(`Signal request accepted.`);
      // Remove the accepted request from the list
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-black p-4 min-h-screen mt-16">
      <h1 className="text-2xl font-bold mb-4">Police Control Center</h1>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="mb-2">
              <span>
                Ambulance requested to change Signal {request.signal.index + 1}{" "}
                to green.
              </span>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded ml-4"
                onClick={() => acceptRequest(request.id)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
