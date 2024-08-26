import React from "react";
import prisma from "@/prisma/db";
import TicketDetail from "./TicketDetail";

interface Props {
  params: { id: string };
}

const ViewTicket = async ({ params }: Props) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN"],
      },
    },
  });

  const replies = await prisma.reply.findMany({
    where: { ticketId: parseInt(params.id) },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!ticket) {
    return <p className="text-destructive">Ticket Not Found!</p>;
  }

  return <TicketDetail ticket={ticket} users={users} replies={replies} />;
};

export default ViewTicket;
