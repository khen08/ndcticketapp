"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

const ToggleMode = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled={true}></Button>;
  }

  const light = theme === "light";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(`${light ? "dark" : "light"}`)}
      className="ml-4"
    >
      {light ? (
        <Moon className="hover:cursor-pointer hover:text-primary" />
      ) : (
        <Sun className="hover:cursor-pointer hover:text-primary" />
      )}
    </Button>
  );
};

export default ToggleMode;
