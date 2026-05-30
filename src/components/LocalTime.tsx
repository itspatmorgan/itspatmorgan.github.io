import { useState, useEffect } from "react";

export function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    update();

    // Align subsequent ticks to the top of each minute
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60_000);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (!time) return null;

  return (
    <span className="font-mono text-xs text-muted-foreground tabular-nums">
      Los Angeles, CA&nbsp;&middot;&nbsp;{time}
    </span>
  );
}
