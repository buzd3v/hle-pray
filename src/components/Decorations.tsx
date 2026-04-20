"use client";

import { motion } from "framer-motion";

interface ArchDecorationProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export function ArchDecoration({ className = "", size = 120, animated = false }: ArchDecorationProps) {
  return (
    <svg
      width={size}
      height={size * 0.55}
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
      width={size}
      height={size}
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

interface HLElogoProps {
  size?: number;
  className?: string;
}

export function HLElogo({ size = 48, className = "" }: HLElogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="23" fill="#0e0e0e" stroke="#3F3F40" strokeWidth="1" />
      <path
        d="M10 34 L10 22 C10 14 18 14 24 14 C30 14 38 14 38 22 L38 34"
        stroke="#f27220"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 34 L10 28 C10 22 17 22 24 22 C31 22 38 22 38 28 L38 34"
        stroke="#3F3F40"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M10 34 L10 32 C10 28 16 28 24 28 C32 28 38 28 38 32 L38 34"
        stroke="#b8babd"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}