"use client";

import { useEffect, useState } from "react";

export default function XPNumber({
  value,
}: {
  value: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += Math.ceil(value / 30);
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setDisplay(start);
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <span>{display.toLocaleString()} XP</span>
  );
}
