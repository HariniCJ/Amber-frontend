// app/api/emergencies/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { condition, injuryType, severity, vitals } = await request.json();

    // Validate input
    if (!condition || !injuryType || !severity || !vitals) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create new emergency
    const emergency = await prisma.emergency.create({
      data: {
        condition,
        injuryType,
        severity,
        vitals: {
          heartRate: vitals.heartRate,
          bloodPressure: vitals.bloodPressure,
          temperature: vitals.temperature,
        },
      },
    });

    return NextResponse.json(emergency, { status: 201 });
  } catch (error) {
    console.error("Error creating emergency:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch all emergencies, sorted by latest first
    const emergencies = await prisma.emergency.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(emergencies, { status: 200 });
  } catch (error) {
    console.error("Error fetching emergencies:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
