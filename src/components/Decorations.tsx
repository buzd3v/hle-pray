"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ArchDecorationProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function ArchDecoration({ className = "", size = 120, animated = false }: ArchDecorationProps) {
  return (
    <svg
      width={`${size / 16}rem`}
      height={`${(size * 0.55) / 16}rem`}
      viewBox="0 0 120 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`archGrad-${size}`} x1="0" y1="0" x2="120" y2="66">
          <stop offset="0%" stopColor="#3F3F40" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#3F3F40" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3F3F40" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M10 66 L10 30 Q10 10 30 10 L90 10 Q110 10 110 30 L110 66"
        stroke={`url(#archGrad-${size})`}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

interface FlameProps {
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export function FlameIcon({ size = 24, color = "#f27220", className = "", animated = false }: FlameProps) {
  return (
    <motion.svg
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? {
        scale: [1, 1.15, 1],
        opacity: [0.8, 1, 0.8],
      } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M12 2C12 2 7 7 7 13C7 16.3137 9.68629 19 13 19C16.3137 19 19 16.3137 19 13C19 7 12 2 12 2Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M12 8C12 8 9 11 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14C15 11 12 8 12 8Z"
        fill={color === "#f27220" ? "#ffb691" : color}
        opacity="0.6"
      />
    </motion.svg>
  );
}

interface OrangeIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function OrangeIcon({ size = 24, className = "", animated = false }: OrangeIconProps) {
  return (
    <motion.svg
      width={`${size / 16}rem`}
      height={`${size / 16}rem`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={animated ? { rotate: [-6, 6, -6], scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="12" cy="13.5" r="8.5" fill="#f27220" />
      <ellipse cx="9" cy="10.5" rx="3" ry="2" fill="#ffb691" opacity="0.55" transform="rotate(-30 9 10.5)" />
      <path d="M12 5.2c0-1.4.6-2.4 1.6-3" stroke="#4b6b2a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.6 5.4c1.6-1.8 4-1.9 5.6-1.2-.9 1.8-3.4 2.7-5.6 1.2Z" fill="#3a9a3a" />
    </motion.svg>
  );
}

interface HLElogoProps {
  size?: number;
  className?: string;
}

export function HLElogo({ size = 48, className = "" }: HLElogoProps) {
  const px = `${size / 16}rem`;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: px, height: px, background: "#f5f3f0", border: "1px solid #3F3F40" }}
    >
      <Image src="/hle_logo.png" alt="Hanwha Life Esports" width={256} height={256} style={{ width: "88%", height: "88%" }} />
    </span>
  );
}