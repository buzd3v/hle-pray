"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Check, PenLine } from "lucide-react";
import { OrangeIcon } from "@/components/Decorations";
import type { OrangeGroveHandle } from "./OrangeGrove";
import type { SITE_COPY } from "@/lib/siteContent";

const OrangeGrove = dynamic(() => import("./OrangeGrove").then((mod) => mod.OrangeGrove), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
      Soori...
    </div>
  ),
});

export type BubbleKey = "greeting" | "picking" | "handed" | "wishFirst" | "alreadyHave";

type GroveCopy = (typeof SITE_COPY)["vi"]["grove"];

interface GroveStageProps {
  copy: GroveCopy;
  handleRef: React.Ref<OrangeGroveHandle>;
  picking: boolean;
  taken: boolean;
  wished: boolean;
  bubble: BubbleKey | null;
  thanksOpen: boolean;
  onRequestPick: (fruitIndex?: number) => void;
  onPickDone: () => void;
  onWriteWish: () => void;
  onCloseThanks: () => void;
}

// Fixed layout so the confetti is identical across renders.
const CONFETTI = [6, 14, 22, 31, 40, 48, 57, 66, 74, 83, 91].map((left, i) => ({
  left,
  delay: (i * 0.37) % 2.4,
  duration: 3.2 + ((i * 0.53) % 2),
  size: 18 + ((i * 7) % 14),
}));

export function GroveStage({
  copy,
  handleRef,
  picking,
  taken,
  wished,
  bubble,
  thanksOpen,
  onRequestPick,
  onPickDone,
  onWriteWish,
  onCloseThanks,
}: GroveStageProps) {
  const steps = copy.steps.map((label, index) => ({
    label,
    done: index === 0 ? taken : index === 1 ? wished : thanksOpen,
  }));
  const bubbleText = bubble && bubble !== "picking" ? copy[bubble] : null; // the button already says "picking"

  return (
    <div
      className="relative mx-auto h-[540px] max-w-6xl overflow-hidden rounded-3xl sm:h-[clamp(35rem,82vh,47.5rem)]"
      style={{
        background: "#0d0f16",
        border: "1px solid rgba(242, 114, 32, 0.22)",
        boxShadow: "0 0 60px rgba(242, 114, 32, 0.12)",
      }}
    >
      <OrangeGrove
        handleRef={handleRef}
        onRequestPick={(index) => onRequestPick(index)}
        onPickDone={onPickDone}
      />

      {/* title */}
      <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-[15rem] sm:left-8 sm:top-7 sm:max-w-sm">
        <p className="mb-2 text-[0.625rem] uppercase tracking-[0.4em] sm:text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
          {copy.eyebrow}
        </p>
        <h2
          className="text-2xl font-extrabold sm:text-4xl"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)", textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}
        >
          {copy.title}
        </h2>
        <p
          className="mt-3 hidden text-sm leading-relaxed sm:block"
          style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
        >
          {copy.subtitle}
        </p>
      </div>

      {/* steps */}
      <ol className="pointer-events-none absolute right-4 top-5 z-10 flex flex-col gap-2 sm:right-8 sm:top-7">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="flex items-center justify-end gap-2 rounded-full py-1.5 pl-3 pr-2 text-xs font-semibold"
            style={{
              background: step.done ? "rgba(242, 114, 32, 0.9)" : "rgba(14, 14, 14, 0.6)",
              color: step.done ? "#fff" : "var(--secondary)",
              border: "1px solid rgba(242, 114, 32, 0.3)",
              fontFamily: "var(--font-display)",
              backdropFilter: "blur(6px)",
              transition: "background 0.3s",
            }}
          >
            <span className="hidden sm:inline">{step.label}</span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem]"
              style={{ background: step.done ? "rgba(255,255,255,0.25)" : "rgba(242, 114, 32, 0.18)" }}
            >
              {step.done ? <Check size="0.75rem" /> : index + 1}
            </span>
          </li>
        ))}
      </ol>

      {/* Soori's speech bubble */}
      <div className="pointer-events-none absolute inset-x-4 bottom-[52%] z-10 flex justify-center sm:inset-x-auto sm:left-1/2 sm:ml-28 sm:block">
        <AnimatePresence mode="wait">
          {bubbleText && !thanksOpen ? (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-xs rounded-2xl px-4 py-3 text-sm font-semibold"
              style={{
                background: "#fff7ee",
                color: "#3b2410",
                fontFamily: "var(--font-body)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              {bubbleText}
              <span
                className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 sm:block"
                style={{ background: "#fff7ee" }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* actions */}
      <div
        className="absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-2 px-4"
        style={{ visibility: thanksOpen ? "hidden" : "visible" }}
      >
        {taken ? (
          <button
            type="button"
            onClick={onWriteWish}
            disabled={wished}
            className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-bold text-white"
            style={{
              background: "var(--primary-container)",
              fontFamily: "var(--font-display)",
              opacity: wished ? 0.6 : 1,
            }}
          >
            <PenLine size="1.125rem" />
            {copy.writeWish}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRequestPick()}
            disabled={picking}
            className="glow-orange inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-bold text-white transition-transform hover:scale-[1.03]"
            style={{
              background: "var(--primary-container)",
              fontFamily: "var(--font-display)",
              opacity: picking ? 0.7 : 1,
              cursor: picking ? "wait" : "pointer",
            }}
          >
            <OrangeIcon size={22} />
            {picking ? copy.picking : copy.pickButton}
          </button>
        )}
        {!taken && !picking ? (
          <p className="text-xs" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            {copy.hint}
          </p>
        ) : null}
      </div>

      {/* thank-you popup, Soori keeps dancing underneath */}
      <AnimatePresence>
        {thanksOpen ? (
          <motion.div
            key="thanks"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "linear-gradient(180deg, rgba(8,8,12,0.65) 0%, rgba(8,8,12,0.1) 55%, rgba(8,8,12,0) 100%)" }}
          >
            {CONFETTI.map((c) => (
              <motion.span
                key={c.left}
                className="pointer-events-none absolute top-0 select-none"
                style={{ left: `${c.left}%`, fontSize: c.size }}
                initial={{ y: -40, rotate: 0, opacity: 0 }}
                animate={{ y: 760, rotate: 360, opacity: [0, 1, 1, 0] }}
                transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
              >
                🍊
              </motion.span>
            ))}

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={copy.thanksTitle}
              initial={{ y: -30, scale: 0.92, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -20, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="absolute left-1/2 top-5 w-[min(92%,26rem)] -translate-x-1/2 rounded-3xl p-6 text-center sm:top-8"
              style={{
                background: "linear-gradient(160deg, #fff7ee 0%, #ffe3c7 100%)",
                color: "#3b2410",
                boxShadow: "0 24px 70px rgba(0,0,0,0.5), 0 0 60px rgba(242, 114, 32, 0.35)",
              }}
            >
              <div className="mb-2 flex justify-center">
                <OrangeIcon size={44} animated />
              </div>
              <h3 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "#d9580f" }}>
                {copy.thanksTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {copy.thanksBody}
              </p>
              <button
                type="button"
                onClick={onCloseThanks}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white"
                style={{ background: "var(--primary-container)", fontFamily: "var(--font-display)" }}
              >
                <OrangeIcon size={18} />
                {copy.thanksClose}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
