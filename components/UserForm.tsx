"use client";
import React, { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { userSchema } from "@/ValidationSchemas/users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button, buttonVariants } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import DeleteButton from "@/app/users/[id]/DeleteButton";

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  user?: User;
}

const UserForm = ({ user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(
    user?.role === "ADMIN"
  );
  const router = useRouter();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      password: "",
      role: user?.role || "USER",
    },
  });

  useEffect(() => {
    if (showPasswordInput) {
      form.setValue("password", "");
    } else {
      form.setValue("password", "nopassword");
    }
  }, [showPasswordInput, form]);

  const handleRoleChange = (value: "ADMIN" | "USER") => {
    form.setValue("role", value);
    setShowPasswordInput(value === "ADMIN");

    if (value === "USER") {
      form.setValue("password", "nopassword");
    }
  };

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      setIsSubmitting(true);
      setError("");

      if (values.role === "USER") {
        values.password = "nopassword";
      } else if (values.role === "ADMIN" && !values.password) {
        setError("Password is required for Admin role.");
        setIsSubmitting(false);
        return;
      }

      if (user) {
        await axios.patch("/api/users/" + user.id, values);
      } else {
        await axios.post("/api/users", values);
        form.reset();
      }

      setIsSubmitting(false);
      router.push("/users");
      router.refresh();
    } catch (error) {
      console.log(error);
      setError("Unknown Error Occurred.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue={user?.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Name..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {showPasswordInput && (
            <FormField
              control={form.control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="role"
              defaultValue={user?.role}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      handleRoleChange(value as "ADMIN" | "USER");
                      field.onChange(value as "ADMIN" | "USER");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Role..."
                          defaultValue={user?.role}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button
              className={buttonVariants({
                variant: "default",
              })}
              type="submit"
              disabled={isSubmitting}
            >
              {user ? "Update User" : "Create User"}
            </Button>
            {user && <DeleteButton userId={user.id} />}
          </div>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
};

export default UserForm;
