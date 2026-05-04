"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe, Music2 } from "lucide-react";
import clsx from "clsx";
import { HLElogo } from "@/components/Decorations";
import { LANGUAGE_OPTIONS } from "@/lib/siteContent";
import type { Language } from "@/types/prayer";

interface NavLink {
  href: string;
  label: string;
}

interface NavBarProps {
  brand: string;
  tagline: string;
  navLinks: NavLink[];
  language: Language;
  setLanguage: (language: Language) => void;
  isMuted: boolean;
  toggleMuted: () => void;
}

export function NavBar({
  brand,
  tagline,
  navLinks,
  language,
  setLanguage,
  isMuted,
  toggleMuted,
}: NavBarProps) {
  const [active, setActive] = useState(navLinks[0]?.href.slice(1) ?? "section-home");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navLinks]);

  const currentLanguage = useMemo(
    () => LANGUAGE_OPTIONS.find((item) => item.value === language) ?? LANGUAGE_OPTIONS[0],
    [language]
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        background: "rgba(14, 14, 14, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(88, 66, 55, 0.15)",
      }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        <a href="#section-home" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <HLElogo size={40} />
          <div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary-container)" }}
            >
              {brand}
            </span>
            <p className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
              {tagline}
            </p>
          </div>
        </a>

        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  isActive ? "glow-orange-soft" : ""
                )}
                style={{
                  fontFamily: "var(--font-display)",
                  color: isActive ? "var(--primary-container)" : "var(--secondary)",
                  background: isActive ? "rgba(242, 114, 32, 0.12)" : "transparent",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setLangOpen((value) => !value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "1px solid rgba(77,70,54,0.3)",
                borderRadius: "4px",
                padding: "6px 12px",
                color: "#e5e2e1",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              <Globe size={14} />
              <span style={{ fontSize: "16px" }}>{currentLanguage.flag}</span>
            </button>

            {langOpen ? (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(77,70,54,0.3)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  minWidth: "160px",
                  zIndex: 100,
                }}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setLanguage(option.value);
                      setLangOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "10px 14px",
                      background: language === option.value ? "rgba(230,195,89,0.1)" : "transparent",
                      border: "none",
                      color: language === option.value ? "#e6c359" : "#e5e2e1",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontFamily: "var(--font-body)",
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{option.flag}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            onClick={toggleMuted}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: isMuted ? "transparent" : "rgba(242, 114, 32, 0.12)",
              border: "1px solid rgba(77,70,54,0.3)",
              borderRadius: "4px",
              padding: "6px 12px",
              color: isMuted ? "#e5e2e1" : "#e6c359",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            <Music2 size={14} />
            <span className="hidden md:inline">{isMuted ? "Muted" : "Music"}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
