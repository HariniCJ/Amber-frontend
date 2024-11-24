import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signalIndex } = body;

    const parsedSignalIndex = Number(signalIndex);
    if (isNaN(parsedSignalIndex)) {
      return NextResponse.json(
        { error: "Invalid signalIndex" },
        { status: 400 }
      );
    }

    // Find the signal by index
    const signal = await prisma.signal.findUnique({
      where: {
        index: parsedSignalIndex,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 });
    }

    // Check if there is already a pending request for this signal
    const existingRequest = await prisma.signalRequest.findFirst({
      where: {
        signalId: signal.id,
        status: "pending",
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: "Signal request already pending" });
    }

    // Create a new SignalRequest with status 'pending'
    const signalRequest = await prisma.signalRequest.create({
      data: {
        signalId: signal.id,
        status: "pending",
      },
    });

    return NextResponse.json({
      message: "Signal request created",
      signalRequest,
    });
  } catch (error) {
    console.error("Error creating signal request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
