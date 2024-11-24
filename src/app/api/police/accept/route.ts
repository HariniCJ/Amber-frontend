import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    // Find the signal request
    const signalRequest = await prisma.signalRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        signal: true,
      },
    });

    if (!signalRequest) {
      return NextResponse.json(
        { error: "Signal request not found" },
        { status: 404 }
      );
    }

    // Update the SignalRequest status to 'accepted'
    await prisma.signalRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "accepted",
      },
    });

    // Update the Signal status to 'green'
    await prisma.signal.update({
      where: {
        id: signalRequest.signalId,
      },
      data: {
        status: "green",
      },
    });

    return NextResponse.json({ message: "Signal request accepted" });
  } catch (error) {
    console.error("Error accepting signal request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
