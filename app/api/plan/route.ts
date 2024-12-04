import { prisma } from "@/prisma/prisma";
import { Plan } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { headers } from "next/headers";

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const plan = await prisma.plan.findFirst({
      where: { name: "dafault_plan", userId: session?.user.id },
      include: { activities: true },
    });
    if (!plan && session) {
      const newPlan = await prisma.plan.create({
        data: {
          name: "dafault_plan",
          userId: session?.user.id,
        },
      });
      return NextResponse.json(newPlan);
    }
    return NextResponse.json(plan);
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

  const id = request.nextUrl.searchParams.get("id");
  const { activities }: Plan = await request.json();

  if (!activities || !id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await prisma.planItem.deleteMany();
    await prisma.plan.update({
      where: { id },
      data: {
        activities: {
          create: activities.map((activity) => ({
            title: activity.title,
            hour: activity.hour ?? 0,
          })),
        },
      },
    });
    return NextResponse.json({ message: "Plan updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
