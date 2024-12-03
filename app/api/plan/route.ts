import { prisma } from "@/prisma/prisma";
import { Plan } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const plan = await prisma.plan.findFirst({
      where: { name: "dafault_plan" },
      include: { activities: true },
    });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const { activities, name }: Plan = await request.json();

  if (!activities || !name) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.planItem.deleteMany();
    await prisma.plan.update({
      where: { name: name },
      data: {
        activities: {
          create: activities.map((activity) => ({
            title: activity.title,
            hour: activity.hour,
          })),
        },
      },
    });
    return NextResponse.json({ message: "Plan updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
