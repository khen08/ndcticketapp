import prisma from "@/prisma/db";
import options from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { userSchema } from "@/ValidationSchemas/users";

export async function POST(request: NextRequest) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Not Authenticated as Admin" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const duplicate = await prisma.user.findUnique({
    where: {
      name: body.name,
    },
  });

  if (duplicate) {
    return NextResponse.json({ message: "Duplicate Name" }, { status: 409 });
  }

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  }

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  return NextResponse.json(newUser, { status: 201 });
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.error();
  }
}
