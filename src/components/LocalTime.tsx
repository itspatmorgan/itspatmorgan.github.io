import { useState, useEffect } from "react";

interface Props {
  compact?: boolean;
}

export function LocalTime({ compact = false }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => {
      setNow(new Date());
    };

    update();

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

  if (!now) return null;

  const time = now.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (compact) {
    return (
      <span className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
        LA&nbsp;&middot;&nbsp;{time}
      </span>
    );
  }

  return (
    <span className="font-mono text-xs text-muted-foreground tabular-nums">
      Los Angeles, CA&nbsp;&middot;&nbsp;{time}
    </span>
  );
}
