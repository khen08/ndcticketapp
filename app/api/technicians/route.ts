import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const technicians = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        assignedTickets: {
          _count: "desc",
        },
      },
    });

    const topTechnicians = technicians.map((technician) => ({
      id: technician.id,
      name: technician.name,
      ticketCount: technician._count.assignedTickets,
    }));

    return NextResponse.json(topTechnicians);
  } catch (error) {
    console.error("Error fetching top technicians:", error);
    return NextResponse.error();
  }
}
