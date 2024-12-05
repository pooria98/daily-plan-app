import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: session?.user.id },
    });

    if (!activities) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    const reducedActivities = Object.values(
      activities.reduce(
        (
          acc: { [key: string]: { id: string; name: string; hour: number; createdAt: Date } },
          item
        ) => {
          if (!acc[item.name]) {
            acc[item.name] = { id: item.id, name: item.name, hour: 0, createdAt: item.createdAt };
          }
          acc[item.name].hour += item.hour;
          return acc;
        },
        {}
      )
    );

    return NextResponse.json(reducedActivities);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
