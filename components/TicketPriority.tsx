import { Priority } from "@prisma/client";
import { IconExclamationCircle } from "@tabler/icons-react";
import React from "react";

interface Props {
  priority: Priority;
}

const priorityMap: Record<Priority, { label: string; level: 1 | 2 | 3 }> = {
  LOW: { label: "Low", level: 1 },
  MEDIUM: { label: "Medium", level: 2 },
  HIGH: { label: "High", level: 3 },
};

const TicketPriority = ({ priority }: Props) => {
  return (
    <div className="flex justify-between">
      <IconExclamationCircle
        className={`${
          priorityMap[priority].level >= 1 ? "text-green-500" : "text-muted"
        }`}
      />
      <IconExclamationCircle
        className={`${
          priorityMap[priority].level >= 2 ? "text-green-500" : "text-muted"
        }`}
      />{" "}
      <IconExclamationCircle
        className={`${
          priorityMap[priority].level >= 3 ? "text-green-500" : "text-muted"
        }`}
      />
    </div>
  );
};

export default TicketPriority;
