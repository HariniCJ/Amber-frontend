import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const signals = await request.json();

    for (const signal of signals) {
      // Ensure signal.index is a number
      const signalIndex = Number(signal.index);
      if (isNaN(signalIndex)) {
        continue; // Skip invalid signal index
      }

      // Upsert the signal in the database
      await prisma.signal.upsert({
        where: { index: signalIndex },
        update: {
          latitude: signal.latitude,
          longitude: signal.longitude,
          status: signal.status,
        },
        create: {
          index: signalIndex,
          latitude: signal.latitude,
          longitude: signal.longitude,
          status: signal.status,
        },
      });
    }

    return NextResponse.json({ message: "Signals initialized" });
  } catch (error) {
    console.error("Error initializing signals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
