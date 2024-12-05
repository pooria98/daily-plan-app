import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Activities } from "@/types/types";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Reset time to midnight (start of today)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // End of today (optional, can be next midnight)

    const activities = await prisma.activity.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: endOfToday, // Optional: If you want to be explicit about the end of today
        },
        userId: session?.user.id,
      },
      orderBy: { createdAt: "desc" },
    });
    if (!activities) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, hour }: Activities = await request.json();

  if (!name || !hour || !session) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.activity.create({
      data: {
        name: name,
        hour: hour,
        userId: session?.user.id,
      },
    });
    return NextResponse.json({ message: "activity created successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.activity.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "activity deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const { name, hour }: Activities = await request.json();

  if (!id || !name || !hour) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.activity.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        hour: hour,
      },
    });
    return NextResponse.json({ message: "activity updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
