"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
};

export function AnimatedCounter({ end, prefix = "", suffix = "", durationMs = 1200 }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, durationMs]);

  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
