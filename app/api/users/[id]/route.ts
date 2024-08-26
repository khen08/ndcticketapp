import prisma from "@/prisma/db";
import { userSchema } from "@/ValidationSchemas/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import options from "@/app/api/auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found." }, { status: 404 });
  }

  if (user.role === "ADMIN" && body.role === "USER") {
    body.password = await bcrypt.hash("nopassword", 10);
  } else if (body.password && body.password !== user.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  if (user.name !== body.name) {
    const duplicateUsername = await prisma.user.findUnique({
      where: { name: body.name },
    });
    if (duplicateUsername) {
      return NextResponse.json({ message: "Duplicate Name" }, { status: 409 });
    }
  }

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateUser);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(params.id);
  const loggedInUserId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found." }, { status: 404 });
  }

  if (userId === loggedInUserId) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "User Deleted",
      redirectTo: "/auth/signin",
    });
  } else {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User Deleted." });
  }
}
