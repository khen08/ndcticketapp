"use client";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Prisma, Ticket } from "@prisma/client";
import React from "react";
import TicketStatusBadge from "./TicketStatusBadge";
import Link from "next/link";
import TicketPriority from "./TicketPriority";
import { motion } from "framer-motion";

type TicketWithUser = Prisma.TicketGetPayload<{
  include: { assignedToUser: true };
}>;

interface Props {
  tickets: TicketWithUser[];
}

const RecentTickets = ({ tickets }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-3"
    >
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {tickets &&
              tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-[80px] text-center">
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <div className="ml-4 space-y-1">
                    <Link href={`tickets/${ticket.id}`}>
                      <p className="font-bold">{ticket.title}</p>
                      <p>
                        Last Update:{" "}
                        {ticket.updatedAt.toLocaleDateString("en-US", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p>Created by: {ticket.createdBy}</p>
                      <p>
                        Technician:{" "}
                        {ticket.assignedToUser?.name || "Unassigned"}
                      </p>
                    </Link>
                  </div>
                  <div className="ml-auto font-medium">
                    <TicketPriority priority={ticket.priority} />
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentTickets;
