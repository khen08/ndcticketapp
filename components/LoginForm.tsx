"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  role: string;
};

export function LoginForm() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data as User[]);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        name: selectedUser,
        password: isAdmin ? password : "nopassword",
      });

      if (result?.error) {
        switch (result.error) {
          case "Invalid password":
            setError("Incorrect username or password.");
            break;
          case "Account is locked. Try again later.":
            setError(
              "Your account is locked due to too many failed login attempts. Please try again later."
            );
            break;
          case "Account is locked due to too many failed attempts. Try again later.":
            setError(
              "Your account is locked due to too many failed login attempts. Please try again later."
            );
            break;
          default:
            setError("An unexpected error occurred.");
            break;
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
    const selectedUser = users.find((user: User) => user.name === userName);
    setIsAdmin(selectedUser?.role === "ADMIN");
  };

  return (
    <Card className="w-full max-w-sm z-10">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: User) => (
                  <SelectItem key={user.name} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isAdmin && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isAdmin}
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedUser || (isAdmin && !password)}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
