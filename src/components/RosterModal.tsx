"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Medal, Trophy, X } from "lucide-react";
import { ROSTER_MODAL_COPY, type RosterMember } from "@/lib/siteContent";
import type { Language } from "@/types/prayer";

interface RosterModalProps {
  member: RosterMember | null;
  language: Language;
  roleLabel: string;
  onClose: () => void;
}

export function RosterModal({ member, language, roleLabel, onClose }: RosterModalProps) {
  const copy = ROSTER_MODAL_COPY[language];

  useEffect(() => {
    if (!member) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [member, onClose]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key={member.id}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(6, 6, 6, 0.82)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={member.ign}
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl"
            style={{
              maxHeight: "92vh",
              background: "var(--surface-container)",
              border: "1px solid rgba(242, 114, 32, 0.3)",
              boxShadow: "0 0 60px rgba(242, 114, 32, 0.2)",
            }}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "rgba(14,14,14,0.7)", color: "var(--on-surface)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <X size="1.125rem" />
            </button>

            <div className="overflow-y-auto overscroll-contain">
            <div className="relative h-[min(24rem,45vh)] w-full shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.detailImage}
                alt={member.ign}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 22%" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(14,14,14,0) 45%, rgba(32,31,31,1) 100%)" }}
              />
              <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between gap-3">
                <div>
                  <h3
                    className="text-4xl font-extrabold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "#f8ecc4", textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}
                  >
                    {member.ign}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
                    {member.name}
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: "rgba(242, 114, 32, 0.18)",
                    color: "var(--primary-container)",
                    border: "1px solid rgba(242, 114, 32, 0.3)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="space-y-6 px-6 pb-6 pt-2">
              <section>
                <h4
                  className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}
                >
                  <Trophy size="0.875rem" style={{ color: "var(--primary-container)" }} />
                  {copy.titles}
                </h4>
                <ul className="space-y-2">
                  {member.titles.map((title) => (
                    <li
                      key={`${title.year}-${title.event}-${title.team}`}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3"
                      style={{ background: "rgba(242, 114, 32, 0.06)", border: "1px solid rgba(242, 114, 32, 0.1)" }}
                    >
                      <span
                        className="w-12 shrink-0 text-sm font-bold"
                        style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}
                      >
                        {title.year}
                      </span>
                      <span className="flex-1 text-sm" style={{ color: "var(--on-surface)", fontFamily: "var(--font-body)" }}>
                        {title.event}
                        <span className="ml-2 text-xs" style={{ color: "var(--tertiary)" }}>
                          {title.team}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-xs font-bold"
                        style={{ color: "#f8ecc4", fontFamily: "var(--font-display)" }}
                      >
                        {title.result === "gold" ? copy.gold : copy.champion}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4
                  className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}
                >
                  <Medal size="0.875rem" style={{ color: "var(--primary-container)" }} />
                  {copy.awards}
                </h4>
                <ul className="space-y-2">
                  {member.awards.map((award) => (
                    <li
                      key={`${award.year}-${award.name}`}
                      className="flex items-start gap-3 rounded-2xl px-4 py-3"
                      style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(88, 66, 55, 0.2)" }}
                    >
                      <span
                        className="w-20 shrink-0 text-sm font-bold"
                        style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}
                      >
                        {award.year}
                      </span>
                      <span className="flex-1 text-sm" style={{ color: "var(--on-surface)", fontFamily: "var(--font-body)" }}>
                        {award.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <p className="text-xs opacity-60" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
                {copy.source}
              </p>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
