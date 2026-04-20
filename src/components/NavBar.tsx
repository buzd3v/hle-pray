"use client";

import { useState, useEffect } from "react";
import { Home, PenLine, History } from "lucide-react";
import { HLElogo } from "@/components/Decorations";
import clsx from "clsx";

const NAV = [
  { href: "#home", label: "Trang Chủ", icon: Home, id: "home" },
  { href: "#pray", label: "Thắp Nến", icon: PenLine, id: "pray" },
  { href: "#history", label: "Lịch Sử", icon: History, id: "history" },
];

export function NavBar() {
  const [active, setActive] = useState("home");

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
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

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
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <HLElogo size={40} />
          <div>
            <span
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary-container)" }}
            >
              HLE PRAYER
            </span>
            <p className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
              Beyond the Challenge
            </p>
          </div>
        </a>

        <div className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon, id }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={href}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  isActive ? "glow-orange-soft" : ""
                )}
                style={{
                  fontFamily: "var(--font-display)",
                  color: isActive ? "var(--primary-container)" : "var(--secondary)",
                  background: isActive ? "rgba(242, 114, 32, 0.12)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                {label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
