import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@components/ui/button";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"light" | "dark">(
    (window.localStorage.getItem("theme") as "light" | "dark" | null) || "light"
  );

  React.useEffect(() => {
    const isDarkMode = window.localStorage.getItem("theme") === "dark";
    setThemeState(isDarkMode ? "dark" : "light");
  }, []);

  React.useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setThemeState(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
