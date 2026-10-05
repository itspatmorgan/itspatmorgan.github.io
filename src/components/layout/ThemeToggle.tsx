import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const current = isDark ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";

    const apply = () => {
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "startViewTransition" in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void })
        .startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="h-8 w-8"
    >
      {theme === "dark" ? (
        <HugeiconsIcon icon={Sun03Icon} size={16} aria-hidden="true" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={16} aria-hidden="true" />
      )}
    </Button>
  );
}
