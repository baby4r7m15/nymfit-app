"use client";

import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    const container = document.createElement("div");
    container.className = "particles";
    document.body.appendChild(container);

    const count = 60;

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");

      span.style.left = Math.random() * 100 + "vw";
      span.style.top = Math.random() * 100 + "vh";
      span.style.animationDuration = 5 + Math.random() * 10 + "s";
      span.style.opacity = String(Math.random());

      container.appendChild(span);
    }

    return () => {
      container.remove();
    };
  }, []);

  return null;
}
