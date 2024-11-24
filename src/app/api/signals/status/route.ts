import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const signalIndexParam = searchParams.get("signalIndex");
    if (signalIndexParam === null) {
      return NextResponse.json(
        { error: "signalIndex parameter is required" },
        { status: 400 }
      );
    }

    const signalIndex = Number(signalIndexParam);

    if (isNaN(signalIndex)) {
      return NextResponse.json(
        { error: "signalIndex must be a number" },
        { status: 400 }
      );
    }

    const signal = await prisma.signal.findUnique({
      where: {
        index: signalIndex,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: "Signal not found" }, { status: 404 });
    }

    return NextResponse.json({ status: signal.status });
  } catch (error) {
    console.error("Error checking signal status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
