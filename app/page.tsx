import React from "react";
import prisma from "@/prisma/db";
import RecentTickets from "@/components/RecentTickets";
import DashboardChart from "@/components/DashboardChart";
import TopCarousel from "@/components/TopCarousel";

const Dashboard = async () => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "SOLVED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div className="px-2">
      <div className="mt-8 grid gap-5 lg:grid-cols-2 md:grid-cols-1">
        <div className="flex flex-col h-full gap-5">
          <RecentTickets tickets={tickets} />
        </div>
        <div className="flex flex-col h-full gap-5">
          <div className="flex-grow">
            <DashboardChart data={data} />
          </div>
          <div className="flex-grow">
            <TopCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
