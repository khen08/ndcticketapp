"use client";
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";

const SignIn = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden">
      <LoginForm />
    </div>
  );
};

export default SignIn;
