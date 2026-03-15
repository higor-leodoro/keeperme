"use client";

import { useState, useRef, useCallback } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, []);

  const cardClasses =
    "w-full px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[340px] sm:max-w-[380px] md:max-w-[400px] max-h-[90dvh]"
      style={{ transition: "transform 0.15s ease-out" }}
    >
      <div
        className="grid w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Login */}
        <div
          className={`${cardClasses} col-start-1 row-start-1`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <LoginForm onFlip={() => setIsFlipped(true)} />
        </div>

        {/* Back - Register */}
        <div
          className={`${cardClasses} col-start-1 row-start-1`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <RegisterForm onFlip={() => setIsFlipped(false)} />
        </div>
      </div>
    </div>
  );
}
