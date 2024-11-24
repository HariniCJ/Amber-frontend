// app/api/ambulance/runAlgorithm/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { latitude, longitude } = requestData;

    // Validate coordinates
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { status: "error", error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Send request to Flask app
    const response = await fetch("http://127.0.0.1:5001/run-algorithm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        status: "success",
        message: result.message,
        hospitals: result.hospitals, // Forward hospitals data
        bestHospital: result.bestHospital,
      });
    } else {
      return NextResponse.json(
        { status: "error", error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { status: "error", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { status: "error", message: "Method Not Allowed" },
    { status: 405 }
  );
}
