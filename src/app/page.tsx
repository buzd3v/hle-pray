"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music2, Pause, Play, Sparkles, Trophy, UserX } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { VideoBackground } from "@/components/VideoBackground";
import { NavBar } from "@/components/NavBar";
import { OrangeIcon, HLElogo } from "@/components/Decorations";
import { GroveStage, type BubbleKey } from "@/components/grove/GroveStage";
import type { OrangeGroveHandle } from "@/components/grove/OrangeGrove";
import { usePrayers } from "@/hooks/usePrayers";
import { useLocalStorageValue, writeLocalStorageValue } from "@/hooks/useLocalStorageValue";
import { ACHIEVEMENT_CARDS, DEFAULT_LANGUAGE, MUSIC_TRACKS, ROSTER_MEMBERS, ROSTER_MODAL_COPY, SITE_COPY } from "@/lib/siteContent";
import { RosterModal } from "@/components/RosterModal";
import type { Language, Prayer } from "@/types/prayer";

const FLOOR_CANDLES = [
  { id: 0, left: 8, delay: 0.1, size: 0.7 },
  { id: 1, left: 14.2, delay: 0.8, size: 0.9 },
  { id: 2, left: 20.4, delay: 1.2, size: 0.6 },
  { id: 3, left: 26.6, delay: 0.3, size: 0.8 },
  { id: 4, left: 32.8, delay: 1.5, size: 0.5 },
  { id: 5, left: 39, delay: 0.6, size: 1.1 },
  { id: 6, left: 45.2, delay: 2.0, size: 0.6 },
  { id: 7, left: 51.4, delay: 0.4, size: 0.7 },
  { id: 8, left: 57.6, delay: 1.8, size: 0.9 },
  { id: 9, left: 63.8, delay: 0.9, size: 0.7 },
  { id: 10, left: 70, delay: 1.1, size: 1.0 },
  { id: 11, left: 76.2, delay: 0.5, size: 1.3 },
  { id: 12, left: 82.4, delay: 1.4, size: 0.8 },
  { id: 13, left: 88.6, delay: 0.7, size: 0.6 },
  { id: 14, left: 8, delay: 2.1, size: 0.8 },
  { id: 15, left: 14.2, delay: 1.6, size: 0.6 },
  { id: 16, left: 20.4, delay: 0.2, size: 0.7 },
  { id: 17, left: 26.6, delay: 2.3, size: 1.1 },
  { id: 18, left: 32.8, delay: 1.0, size: 0.8 },
  { id: 19, left: 39, delay: 0.8, size: 1.2 },
  { id: 20, left: 45.2, delay: 1.9, size: 0.7 },
  { id: 21, left: 51.4, delay: 0.4, size: 1.2 },
  { id: 22, left: 57.6, delay: 2.5, size: 0.8 },
  { id: 23, left: 63.8, delay: 1.3, size: 0.6 },
  { id: 24, left: 70, delay: 0.6, size: 0.7 },
  { id: 25, left: 76.2, delay: 1.7, size: 1.0 },
  { id: 26, left: 82.4, delay: 2.2, size: 1.0 },
  { id: 27, left: 88.6, delay: 0.9, size: 0.5 },
];

const ROLE_LABELS: Record<Language, Record<string, string>> = {
  vi: {
    top: "Đường trên",
    jungle: "Rừng",
    mid: "Giữa",
    adc: "Xạ thủ",
    support: "Hỗ trợ",
  },
  en: {
    top: "Top",
    jungle: "Jungle",
    mid: "Mid",
    adc: "ADC",
    support: "Support",
  },
  ko: {
    top: "탑",
    jungle: "정글",
    mid: "미드",
    adc: "원딜",
    support: "서포터",
  },
};

function formatTime(date: Date, language: Language) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (language === "en") {
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} d ago`;
  }

  if (language === "ko") {
    if (minutes < 1) return "방금";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  }

  if (minutes < 1) return "vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

const LANGUAGE_KEY = "hle-pray-language";
const MUTED_KEY = "hle-pray-muted";
const NAME_KEY = "hle-pray-name";

function parseLanguage(stored: string | null): Language {
  if (stored === "vi" || stored === "en" || stored === "ko") return stored;
  return DEFAULT_LANGUAGE;
}

export default function HomePage() {
  const language = parseLanguage(useLocalStorageValue(LANGUAGE_KEY));
  const storedMuted = useLocalStorageValue(MUTED_KEY);
  const isMuted = storedMuted ? storedMuted === "true" : true;
  const [activeTrack, setActiveTrack] = useState<"ambient" | "celebration">("ambient");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  // The name is remembered in this browser, so visitors only type it once.
  // The draft keeps the input working even when storage is unavailable (private mode).
  const storedName = useLocalStorageValue(NAME_KEY);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const name = nameDraft ?? storedName ?? "";
  const setName = (value: string) => {
    setNameDraft(value);
    writeLocalStorageValue(NAME_KEY, value);
  };
  const [anonymous, setAnonymous] = useState(false);
  const [grove, setGrove] = useState<{
    taken: boolean;
    wished: boolean;
    picking: boolean;
    thanks: boolean;
    bubble: BubbleKey | null;
  }>({ taken: false, wished: false, picking: false, thanks: false, bubble: "greeting" });
  const { prayers, addPrayer } = usePrayers();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const groveRef = useRef<OrangeGroveHandle>(null);
  const groveSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  // Mirror of the flow state, readable from callbacks fired by the 3D scene.
  const flow = useRef({ taken: false, wished: false, picking: false });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const track = MUSIC_TRACKS.find((item) => item.id === activeTrack) ?? MUSIC_TRACKS[0];
    // Only swap the source when it really changes, so muting or switching to the same song doesn't restart it.
    if (audio.dataset.track !== track.src) {
      audio.dataset.track = track.src;
      audio.src = track.src;
    }
    audio.loop = true;
    audio.muted = isMuted;
    audio.volume = 0.75;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Browsers may block autoplay until the user interacts with the page.
      });
    }
  }, [activeTrack, isMuted]);

  const closeRosterModal = useCallback(() => setSelectedMemberId(null), []);
  const selectedMember = ROSTER_MEMBERS.find((member) => member.id === selectedMemberId) ?? null;

  const copy = SITE_COPY[language];
  const presets = copy.prayer.presets;
  const allPrayers = prayers.slice(0, 20);

  const handleLanguageChange = (nextLanguage: Language) => {
    writeLocalStorageValue(LANGUAGE_KEY, nextLanguage);
  };

  const handleToggleMuted = () => {
    writeLocalStorageValue(MUTED_KEY, String(!isMuted));
  };

  const scrollTo = (target: HTMLElement | null) => {
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Orange picked and wish sent (in either order): Soori thanks the visitor and dances.
  const finishFlow = () => {
    setGrove((state) => ({ ...state, thanks: true, bubble: null }));
    setActiveTrack("celebration");
    groveRef.current?.celebrate();
  };

  const requestPick = (fruitIndex?: number, bubble: BubbleKey = "picking") => {
    const f = flow.current;
    if (f.picking) return;
    if (f.taken) {
      setGrove((state) => ({ ...state, bubble: "alreadyHave" }));
      return;
    }
    f.picking = true;
    setGrove((state) => ({ ...state, picking: true, bubble }));
    groveRef.current?.pickOrange(fruitIndex);
  };

  const handlePickDone = () => {
    const f = flow.current;
    f.picking = false;
    f.taken = true;
    setGrove((state) => ({ ...state, taken: true, picking: false, bubble: "handed" }));
    if (f.wished) finishFlow();
  };

  const handleCloseThanks = () => {
    flow.current = { taken: false, wished: false, picking: false };
    setGrove({ taken: false, wished: false, picking: false, thanks: false, bubble: "greeting" });
    setActiveTrack("ambient");
    groveRef.current?.stopCelebrate();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = selectedPreset || customText.trim();
    if (!text || grove.thanks) return;

    addPrayer(name, text);
    setSelectedPreset(null);
    setCustomText("");
    setAnonymous(false);

    const f = flow.current;
    f.wished = true;
    setGrove((state) => ({ ...state, wished: true }));
    scrollTo(groveSectionRef.current);

    if (f.taken) {
      finishFlow();
    } else if (f.picking) {
      setGrove((state) => ({ ...state, bubble: "wishFirst" }));
    } else {
      requestPick(undefined, "wishFirst");
    }
  };

  const trackLabel = MUSIC_TRACKS.find((track) => track.id === activeTrack)?.label ?? "Orchard ambience";

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <audio ref={audioRef} preload="auto" />
      <VideoBackground />
      <ParticleBackground />

      <NavBar
        brand={copy.brand}
        tagline={copy.tagline}
        navLinks={copy.nav}
        language={language}
        setLanguage={handleLanguageChange}
        isMuted={isMuted}
        toggleMuted={handleToggleMuted}
      />

      <section
        id="section-home"
        className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center gap-6 mb-6">
              <HLElogo size={120} />
            </div>
            <p
              className="text-sm uppercase tracking-[0.4em] mb-4"
              style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}
            >
              {copy.hero.eyebrow}
            </p>
            <h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
                color: "var(--primary-container)",
              }}
            >
              {copy.hero.title}
            </h1>
            <p
              className="text-xl md:text-3xl font-bold tracking-[0.25em] mb-6"
              style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
            >
              {copy.hero.subtitle}
            </p>
            <p
              className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
              style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
            >
              {copy.hero.description}
            </p>

            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              <a
                href="#section-prayer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base glow-orange"
                style={{ background: "var(--primary-container)", fontFamily: "var(--font-display)", textDecoration: "none" }}
              >
                <Sparkles size="1.125rem" />
                {copy.hero.primaryCta}
              </a>
              <a
                href="#section-roster"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base"
                style={{
                  background: "rgba(242, 114, 32, 0.08)",
                  color: "var(--primary-container)",
                  border: "1px solid rgba(242, 114, 32, 0.2)",
                  fontFamily: "var(--font-display)",
                  textDecoration: "none",
                }}
              >
                {copy.hero.secondaryCta}
                <ArrowRight size="1.125rem" />
              </a>
            </div>
          </motion.div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          {FLOOR_CANDLES.map((candle) => (
            <motion.div
              key={candle.id}
              className="absolute bottom-0 rounded-full"
              style={{
                left: `${candle.left}%`,
                width: candle.size,
                height: candle.size * 3,
                background: "var(--primary-container)",
              }}
              animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: candle.delay, ease: "easeInOut" }}
            />
          ))}
        </div>
      </section>

      <section id="section-prayer" className="py-24 px-6 relative z-10">
        <div ref={groveSectionRef} className="mb-14">
          <GroveStage
            copy={copy.grove}
            handleRef={groveRef}
            picking={grove.picking}
            taken={grove.taken}
            wished={grove.wished}
            bubble={grove.bubble}
            thanksOpen={grove.thanks}
            onRequestPick={(index) => requestPick(index)}
            onPickDone={handlePickDone}
            onWriteWish={() => scrollTo(formRef.current)}
            onCloseThanks={handleCloseThanks}
          />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p
                className="text-xs uppercase tracking-[0.4em] mb-3"
                style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}
              >
                {copy.prayer.title}
              </p>
              <h2
                className="text-4xl md:text-5xl font-extrabold mb-4"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)" }}
              >
                {copy.prayer.subtitle}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: "rgba(242, 114, 32, 0.12)", color: "var(--primary-container)" }}
                >
                  <Music2 size="0.875rem" />
                  {copy.prayer.musicLabel}: {trackLabel} · {isMuted ? copy.prayer.musicOff : copy.prayer.musicOn}
                </div>
              </div>
              <p
                className="mt-4 text-base leading-relaxed max-w-xl"
                style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
              >
                {copy.hero.description}
              </p>
            </div>

            <div className="rounded-3xl p-8" style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.1)" }}>
              <div className="flex justify-center mb-5">
                <OrangeIcon size={88} animated />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <HLElogo size={36} />
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                    TRUST · TEAMWORK · INNOVATION
                  </p>
                  <p className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
                    {copy.prayer.wallTag}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            ref={formRef}
            className="rounded-3xl p-8"
            style={{
              background: "var(--surface-container)",
              border: grove.taken && !grove.wished ? "1px solid rgba(242, 114, 32, 0.6)" : "1px solid rgba(88, 66, 55, 0.1)",
              boxShadow: grove.taken && !grove.wished ? "0 0 36px rgba(242, 114, 32, 0.25)" : "none",
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}
          >
            <h3
              className="text-xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--on-background)" }}
            >
              {copy.prayer.title}
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
              {copy.prayer.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {presets.map((preset, index) => (
                <button
                  key={`${preset}-${index}`}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomText(preset);
                  }}
                  className="text-left rounded-2xl px-4 py-4 transition-all duration-300"
                  style={{
                    background: selectedPreset === preset ? "rgba(242, 114, 32, 0.18)" : "rgba(242, 114, 32, 0.06)",
                    border: `1px solid ${selectedPreset === preset ? "rgba(242, 114, 32, 0.5)" : "rgba(88, 66, 55, 0.12)"}`,
                    color: selectedPreset === preset ? "var(--primary-container)" : "var(--on-surface)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={customText}
                onChange={(event) => {
                  setCustomText(event.target.value);
                  if (event.target.value.trim()) {
                    setSelectedPreset(null);
                  }
                }}
                placeholder={copy.prayer.placeholder}
                rows={5}
                className="w-full rounded-2xl px-4 py-4 text-sm resize-none"
                style={{
                  background: "rgba(14,14,14,0.56)",
                  border: customText ? "1px solid rgba(242, 114, 32, 0.45)" : "1px solid rgba(88, 66, 55, 0.18)",
                  color: "var(--on-surface)",
                  fontFamily: "var(--font-body)",
                }}
              />

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
                    {copy.prayer.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={copy.prayer.namePlaceholder}
                    className="w-full rounded-2xl px-4 py-3 text-sm"
                    style={{
                      background: "rgba(14,14,14,0.56)",
                      border: "1px solid rgba(88, 66, 55, 0.18)",
                      color: "var(--on-surface)",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                </div>

                <label className="flex items-center gap-3 sm:self-end rounded-2xl px-4 py-3" style={{ border: "1px solid rgba(88, 66, 55, 0.18)" }}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                    style={{ accentColor: "#f27220", width: 16, height: 16 }}
                  />
                  <UserX size="1rem" />
                  <span style={{ color: "var(--on-surface)", fontFamily: "var(--font-body)" }}>{copy.prayer.anonymous}</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                <button
                  type="submit"
                  disabled={(!selectedPreset && !customText.trim()) || grove.thanks}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold"
                  style={{
                    background: (!selectedPreset && !customText.trim()) || grove.thanks ? "rgba(242, 114, 32, 0.22)" : "var(--primary-container)",
                    color: "white",
                    fontFamily: "var(--font-display)",
                    cursor: (!selectedPreset && !customText.trim()) || grove.thanks ? "not-allowed" : "pointer",
                    opacity: (!selectedPreset && !customText.trim()) || grove.thanks ? 0.6 : 1,
                  }}
                >
                  <Sparkles size="1rem" />
                  {copy.prayer.submit}
                </button>

                <button
                  type="button"
                  onClick={handleToggleMuted}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold"
                  style={{
                    background: "rgba(242, 114, 32, 0.08)",
                    color: "var(--primary-container)",
                    border: "1px solid rgba(242, 114, 32, 0.15)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {isMuted ? <Play size="1rem" /> : <Pause size="1rem" />}
                  {copy.prayer.musicLabel}: {isMuted ? copy.prayer.musicOff : copy.prayer.musicOn}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <section id="section-roster" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
              {copy.roster.eyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)" }}>
              {copy.roster.title}
            </h2>
            <p className="max-w-3xl text-sm md:text-base" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
              {copy.roster.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 xl:gap-5">
            {ROSTER_MEMBERS.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{
                  borderColor: "rgba(242, 114, 32, 0.55)",
                  boxShadow: "0 0 28px rgba(242, 114, 32, 0.25)",
                }}
                className="rounded-3xl overflow-hidden flex flex-col cursor-pointer"
                style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.12)" }}
                role="button"
                tabIndex={0}
                aria-label={`${member.ign} — ${ROSTER_MODAL_COPY[language].viewDetail}`}
                onClick={() => setSelectedMemberId(member.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedMemberId(member.id);
                  }
                }}
              >
                <div
                  className="relative h-72 shrink-0"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(6,6,6,0) 0%, rgba(6,6,6,0.55) 100%), url(${member.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: member.imagePosition,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                  <span
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.6875rem] font-bold"
                    style={{
                      background: "rgba(14,14,14,0.7)",
                      color: "var(--primary-container)",
                      border: "1px solid rgba(242, 114, 32, 0.35)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <Trophy size="0.75rem" />
                    {ROSTER_MODAL_COPY[language].viewDetail}
                  </span>
                  <div
                    className="absolute bottom-4 left-4 right-4 text-center text-[2.1rem]"
                    style={{
                      fontFamily: "var(--font-display)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontWeight: 700,
                      color: "rgba(248,236,196,0.86)",
                      textShadow: "0 0 16px rgba(255,236,178,0.35), 0 4px 16px rgba(0,0,0,0.5)",
                    }}
                  >
                    {member.ign}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
                        {member.ign}
                      </h3>
                      <p className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
                        {member.name}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(242, 114, 32, 0.12)",
                        color: "var(--primary-container)",
                        border: "1px solid rgba(242, 114, 32, 0.2)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {ROLE_LABELS[language][member.role]}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
                    {member.bio[language]}
                  </p>

                  <blockquote
                    className="rounded-2xl p-4 text-sm"
                    style={{ background: "rgba(242, 114, 32, 0.06)", border: "1px solid rgba(242, 114, 32, 0.1)", color: "var(--on-surface)", fontFamily: "var(--font-body)" }}
                  >
                    “{member.quote}”
                  </blockquote>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="section-achievements" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
              {copy.achievements.eyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)" }}>
              {copy.achievements.title}
            </h2>
            <p className="max-w-3xl text-sm md:text-base" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
              {copy.achievements.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {ACHIEVEMENT_CARDS.map((card, index) => (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl overflow-hidden"
                style={{
                  minHeight: "20rem",
                  backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.16) 0%, rgba(8,8,8,0.92) 70%), url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid rgba(242, 114, 32, 0.16)",
                  boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
                }}
              >
                <div className="p-6 flex h-full flex-col justify-end gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit" style={{ background: "rgba(242, 114, 32, 0.18)", color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>
                    <Trophy size="0.875rem" />
                    {card.badge}
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#f8ecc4" }}>
                      {card.title}
                    </p>
                    <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
                      {card.year}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
                    {card.description[language]}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="section-wishes" className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
              {copy.wishes.title}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)" }}>
              {copy.wishes.subtitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[17.5rem_minmax(0,1fr)_17.5rem] gap-6 items-start">
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-5 space-y-4"
              style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.1)" }}
            >
              <div className="rounded-2xl p-4" style={{ background: "rgba(242, 114, 32, 0.08)" }}>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
                  {copy.prayer.musicLabel}
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--on-surface)", fontFamily: "var(--font-body)" }}>
                  {MUSIC_TRACKS.map((track) => track.label).join(" · ")}
                </p>
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {allPrayers.length === 0 ? (
                <div className="rounded-3xl p-12 text-center" style={{ background: "var(--surface-container)", color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
                  {copy.wishes.empty}
                </div>
              ) : (
                allPrayers.map((prayer: Prayer, index: number) => (
                  <motion.article
                    key={prayer.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.04, 0.35), duration: 0.35 }}
                    className="rounded-3xl p-5"
                    style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.08)" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <OrangeIcon size={22} animated />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: "var(--on-surface)", fontFamily: "var(--font-display)" }}>
                            {prayer.name}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(242, 114, 32, 0.12)", color: "var(--primary-container)", fontFamily: "var(--font-body)" }}>
                            {copy.wishes.burning}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
                          {prayer.content}
                        </p>
                        <p suppressHydrationWarning className="text-xs mt-2" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
                          {formatTime(prayer.createdAt, language)}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-5 space-y-4"
              style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.1)" }}
            >
              <div className="rounded-2xl p-5" style={{ background: "rgba(242, 114, 32, 0.06)" }}>
                <h3 className="text-xs font-bold mb-4 uppercase tracking-[0.2em]" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)" }}>
                  {copy.prayer.title}
                </h3>
                {[copy.prayer.presets[0], copy.prayer.presets[1], copy.prayer.presets[2]]
                  .filter(Boolean)
                  .map((quote) => (
                    <p key={quote} className="text-sm leading-relaxed py-2" style={{ color: "var(--on-surface)", fontFamily: "var(--font-body)" }}>
                      “{quote}”
                    </p>
                  ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <RosterModal
        member={selectedMember}
        language={language}
        roleLabel={selectedMember ? ROLE_LABELS[language][selectedMember.role] : ""}
        onClose={closeRosterModal}
      />

      <footer
        className="py-12 px-6 text-center"
        style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}
      >
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <HLElogo size={28} />
            <span className="font-bold tracking-[0.2em]" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>
              {copy.brand}
            </span>
          </div>
          <p className="text-sm mb-2" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>
            {copy.footer}
          </p>
          <p className="text-xs opacity-70">© 2026 Hanwha Life Esports lucky orange wall</p>
        </div>
      </footer>
    </div>
  );
}
