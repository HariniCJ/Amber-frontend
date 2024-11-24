import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const route = await prisma.route.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bestHospital: true,
      },
    });

    if (route) {
      return NextResponse.json(route);
    } else {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
