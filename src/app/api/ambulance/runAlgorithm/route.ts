// app/api/ambulance/runAlgorithm/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Static latitude and longitude values
    const data = {
      latitude: 12.893943,
      longitude: 77.674585,
    };

    // Send request to Flask app
    const response = await fetch("http://127.0.0.1:5001/run-algorithm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        status: "success",
        message: result.message,
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
