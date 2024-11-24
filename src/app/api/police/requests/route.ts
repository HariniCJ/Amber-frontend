import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingRequests = await prisma.signalRequest.findMany({
      where: {
        status: "pending",
      },
      include: {
        signal: true,
      },
    });

    return NextResponse.json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
