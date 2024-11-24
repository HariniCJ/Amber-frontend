// components/EmergencyForm.tsx

"use client";

import { useState } from "react";

interface Vitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
}

export default function EmergencyForm() {
  const [condition, setCondition] = useState("");
  const [injuryType, setInjuryType] = useState("");
  const [severity, setSeverity] = useState("");
  const [vitals, setVitals] = useState<Vitals>({
    heartRate: 0,
    bloodPressure: "",
    temperature: 0,
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !condition ||
      !injuryType ||
      !severity ||
      vitals.heartRate === 0 ||
      !vitals.bloodPressure ||
      vitals.temperature === 0
    ) {
      setSubmissionStatus("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch("/api/emergencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condition,
          injuryType,
          severity,
          vitals,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmissionStatus("Emergency submitted successfully.");
        // Reset form
        setCondition("");
        setInjuryType("");
        setSeverity("");
        setVitals({
          heartRate: 0,
          bloodPressure: "",
          temperature: 0,
        });
      } else {
        setSubmissionStatus(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting emergency:", error);
      setSubmissionStatus("Error submitting emergency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVitalsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVitals((prev) => ({
      ...prev,
      [name]:
        name === "heartRate" || name === "temperature" ? Number(value) : value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8 border border-black">
      <h2 className="text-2xl font-semibold mb-4 text-black">
        Report Patient Emergency
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Condition */}
        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700"
          >
            Condition
          </label>
          <textarea
            id="condition"
            name="condition"
            rows={3}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
            placeholder="Describe the patient's condition"
            required
          ></textarea>
        </div>

        {/* Injury Type */}
        <div>
          <label
            htmlFor="injuryType"
            className="block text-sm font-medium text-gray-700"
          >
            Injury Type
          </label>
          <input
            type="text"
            id="injuryType"
            name="injuryType"
            value={injuryType}
            onChange={(e) => setInjuryType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
            placeholder="e.g., Fracture, Burn, etc."
            required
          />
        </div>

        {/* Severity */}
        <div>
          <label
            htmlFor="severity"
            className="block text-sm font-medium text-gray-700"
          >
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
            required
          >
            <option value="">-- Select Severity --</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>

        {/* Vitals */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Vitals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Heart Rate */}
            <div>
              <label
                htmlFor="heartRate"
                className="block text-sm font-medium text-gray-700"
              >
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                id="heartRate"
                name="heartRate"
                value={vitals.heartRate}
                onChange={handleVitalsChange}
                className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
                placeholder="e.g., 72"
                required
                min="30"
                max="200"
              />
            </div>

            {/* Blood Pressure */}
            <div>
              <label
                htmlFor="bloodPressure"
                className="block text-sm font-medium text-gray-700"
              >
                Blood Pressure
              </label>
              <input
                type="text"
                id="bloodPressure"
                name="bloodPressure"
                value={vitals.bloodPressure}
                onChange={(e) =>
                  setVitals((prev) => ({
                    ...prev,
                    bloodPressure: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
                placeholder="e.g., 120/80"
                required
              />
            </div>

            {/* Temperature */}
            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700"
              >
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                id="temperature"
                name="temperature"
                value={vitals.temperature}
                onChange={handleVitalsChange}
                className="mt-1 block w-full rounded-md border border-gray-500 shadow-sm focus:border-black focus:ring-black"
                placeholder="e.g., 36.6"
                required
                min="30"
                max="45"
              />
            </div>
          </div>
        </div>

        {/* Submission Status */}
        {submissionStatus && (
          <div>
            <p
              className={`text-sm ${
                submissionStatus.startsWith("Error")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {submissionStatus}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
          >
            {isSubmitting ? "Submitting..." : "Submit Emergency"}
          </button>
        </div>
      </form>
    </div>
  );
}
