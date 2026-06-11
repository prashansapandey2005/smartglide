import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: {
        enrollments: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const purchasedCourses = user.enrollments.map(e => e.courseId);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        purchasedCourses,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
