import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(255)
    .optional()
    .or(z.literal("")),
  role: z.enum(["USER", "ADMIN"]),
});
