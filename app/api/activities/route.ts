import { prisma } from "@/prisma/prisma";
import { Activities } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const activities = await prisma.activity.findMany({
      where: { createdAt: { lt: new Date() } },
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
  const { name, hour }: Activities = await request.json();

  if (!name || !hour) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.activity.create({
      data: {
        name: name,
        hour: hour,
      },
    });
    return NextResponse.json({ message: "activity created successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
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
