"use client";
import { Ticket, User, Reply } from "@prisma/client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketStatusBadge from "@/components/TicketStatusBadge";
import TicketPriority from "@/components/TicketPriority";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import DeleteButton from "./DeleteButton";
import AssignTicket from "@/components/AssignTicket";
import axios from "axios";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DeleteReply from "./DeleteReply";
import { getSession } from "next-auth/react";

interface Props {
  ticket: Ticket;
  users: User[];
  replies: (Reply & { user: { id: number; name: string } })[];
}

const ReplyForm = dynamic(() => import("@/components/ReplyForm"), {
  ssr: false,
});

const TicketDetail = ({ ticket, users, replies: initialReplies }: Props) => {
  const [replies, setReplies] =
    useState<(Reply & { user: { id: number; name: string } })[]>(
      initialReplies
    );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchReplies = async () => {
    try {
      const response = await axios.get(`/api/tickets/${ticket.id}/replies`);
      setReplies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const session = await getSession();
      if (session && session.user) {
        setCurrentUser(session.user as User);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplyDeleted = () => {
    fetchReplies();
  };

  useEffect(() => {
    fetchReplies();
    fetchCurrentUser();
  }, [ticket.id]);

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Replies:", replies);
  }, [currentUser, replies]);

  return (
    <div className="mt-8 lg:grid lg:grid-cols-5">
      <Card className="mx-4 mb-4 lg:col-span-full lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriority priority={ticket.priority} />
          </div>
          <CardTitle>{ticket.title}</CardTitle>
          <CardDescription>
            Created by: {ticket.createdBy} |{" "}
            {new Date(ticket.createdAt).toLocaleDateString("en-US", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4">
          <ReactMarkDown>{ticket.description}</ReactMarkDown>
        </CardContent>
        <CardFooter className="text-sm">
          Updated:{" "}
          {new Date(ticket.updatedAt).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </CardFooter>
      </Card>
      <div className="pl-4 mb-3 mx-4 flex lg:flex-col lg:mx-0 gap-2">
        {currentUser && (
          <>
            {(currentUser.name === ticket.createdBy ||
              currentUser.role === "ADMIN") && (
              <>
                <Link
                  href={`/tickets/edit/${ticket.id}`}
                  className={`${buttonVariants({
                    variant: "secondary",
                  })}`}
                >
                  Edit Ticket
                </Link>
                <DeleteButton ticketId={ticket.id} />
              </>
            )}
          </>
        )}
        <AssignTicket ticket={ticket} users={users} />
      </div>
      <Card className="mx-4 mb-4 lg:col-span-4 lg:mr-4">
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent className="my-2">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="mb-10 border-solid border-zinc-500 border-l-2 px-6 py-4"
            >
              <ReactMarkDown>{reply.content}</ReactMarkDown>
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 flex items-center justify-between">
                    by:{" "}
                    <Avatar className="mx-2">
                      <AvatarFallback className=" bg-rose-600">
                        {reply.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {reply.user.name}
                  </p>
                  <p className="text-sm pl-3 text-gray-500">
                    {new Date(reply.createdAt).toLocaleDateString("en-US", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="ml-auto">
                  {currentUser &&
                    (currentUser.id === reply.userId ||
                      currentUser.role === "ADMIN") && (
                      <DeleteReply
                        ticketId={ticket.id}
                        replyId={reply.id}
                        userId={currentUser.id}
                        userRole={currentUser.role}
                        onReplyDeleted={handleReplyDeleted}
                      />
                    )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          {currentUser ? (
            <ReplyForm ticketId={ticket.id} onReplySubmitted={fetchReplies} />
          ) : (
            <p className="text-gray-500">Log in to add a reply.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketDetail;
