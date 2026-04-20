"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, Trophy } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { NavBar } from "@/components/NavBar";
import { ArchDecoration, FlameIcon, HLElogo } from "@/components/Decorations";
import { usePrayers } from "@/hooks/usePrayers";
import { STATS, SAMPLE_PRAYERS } from "@/types/prayer";

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

function formatTime(date: Date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

const TOP_PRAYERS = [
  { name: "Zeus Fanclub", count: 847 },
  { name: "Viper Supporter", count: 623 },
  { name: "Peanut Lover", count: 511 },
  { name: "Zeka Stan", count: 398 },
  { name: "HLE Vietnam", count: 276 },
];

const MAX_CHARS = 500;

export default function HomePage() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { prayers, addPrayer } = usePrayers();

  const charCount = content.length;
  const canSubmit = content.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    addPrayer(name, content.trim());
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    await new Promise((r) => setTimeout(r, 2200));
    setIsSuccess(false);
    setName("");
    setContent("");
  }

  const allPrayers = [...prayers, ...SAMPLE_PRAYERS].slice(0, 20);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "var(--background)" }}>
      <ParticleBackground />
      <NavBar />

      <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-center gap-6 mb-6">
              <ArchDecoration size={140} className="animate-arch" />
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--primary-container)" }}>
              HLE PRAYER
            </h1>
            <p className="text-lg font-medium mb-2" style={{ color: "var(--secondary)", fontFamily: "var(--font-body)" }}>
              Thắp Nến Nguyện Cầu
            </p>
            <div className="flex justify-center mb-8">
              <div className="h-0.5 w-24 rounded-full" style={{ background: "var(--primary-container)" }} />
            </div>
          </motion.div>

          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="relative my-10">
            <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(ellipse at center bottom, rgba(242, 114, 32, 0.2) 0%, transparent 70%)", filter: "blur(30px)" }} />
            <div className="relative rounded-3xl py-16 px-8" style={{ background: "linear-gradient(180deg, rgba(242, 114, 32, 0.06) 0%, rgba(242, 114, 32, 0.02) 100%)", border: "1px solid rgba(242, 114, 32, 0.15)" }}>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <FlameIcon size={64} color="#f27220" animated />
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(242, 114, 32, 0.3) 0%, transparent 70%)", filter: "blur(10px)" }} />
                </div>
              </div>
              <p className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--on-background)" }}>
                {STATS.total.toLocaleString("vi-VN")}
              </p>
              <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>lượt thắp nến nguyện cầu</p>
            </div>
          </motion.div>

          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="grid grid-cols-2 gap-4 mb-10">
            {[
              { label: "Hôm nay", value: STATS.today },
              { label: "Tuần này", value: STATS.week },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl py-5 px-6 text-left" style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.1)" }}>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary-container)" }}>
                  {value.toLocaleString("vi-VN")}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
            <a href="#pray" className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold text-base glow-orange" style={{ background: "var(--primary-container)", fontFamily: "var(--font-display)" }}>
              <FlameIcon size={20} color="white" />
              Thắp Nến Nguyện Cầu
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          {FLOOR_CANDLES.map((c) => (
            <motion.div key={c.id} className="absolute bottom-0 rounded-full" style={{ left: `${c.left}%`, width: c.size, height: c.size * 3, background: "var(--primary-container)" }} animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity, delay: c.delay, ease: "easeInOut" }} />
          ))}
        </div>
      </section>

      <section id="pray" className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-5xl w-full mx-auto grid grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="space-y-8">
            <div>
              <h1 className="text-5xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--primary-container)" }}>
                Thắp Nến<br />Nguyện Cầu
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>
                Gửi lời nguyện đến đội tuyển <strong style={{ color: "var(--primary-container)" }}>Hanwha Life Esports</strong>.<br />
                Để niềm tin, tinh thần đồng đội và sự sáng tạo bay lên cùng HLE.
              </p>
              <div className="flex justify-start mb-8">
                <ArchDecoration size={160} animated />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Tổng lượt thắp nến", value: STATS.total },
                  { label: "Hôm nay", value: STATS.today },
                  { label: "Tuần này", value: STATS.week },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 px-4 rounded-xl" style={{ background: "var(--surface-container)" }}>
                    <span className="text-sm" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>{label}</span>
                    <span className="font-bold" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>{value.toLocaleString("vi-VN")}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <HLElogo size={36} />
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>TRUST · TEAMWORK · INNOVATION</p>
                  <p className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>The Energetic Life</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
            <div className="rounded-3xl p-8" style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.1)" }}>
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--on-background)" }}>Thắp Nến Nguyện Cầu</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>TÊN CỦA BẠN (tuỳ chọn)</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous" maxLength={50} className="w-full py-3 px-4 rounded-xl text-sm transition-all duration-300" style={{ background: "var(--surface-container-high)", color: "var(--on-background)", border: "1px solid rgba(88, 66, 55, 0.2)", fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>LỜI NGUYỆN CẦU</label>
                  <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))} placeholder="Hãy viết lời nguyện của bạn cho HLE ở đây..." rows={6} className="w-full py-3 px-4 rounded-xl text-sm resize-none transition-all duration-300" style={{ background: "var(--surface-container-high)", color: "var(--on-background)", border: "1px solid rgba(88, 66, 55, 0.2)", fontFamily: "var(--font-body)" }} />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs" style={{ color: charCount >= MAX_CHARS * 0.9 ? "var(--primary-container)" : "var(--tertiary)", fontFamily: "var(--font-body)" }}>{charCount} / {MAX_CHARS}</span>
                  </div>
                </div>
                <motion.button type="submit" disabled={!canSubmit || isSubmitting} className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 transition-all duration-300" style={{ background: canSubmit && !isSubmitting && !isSuccess ? "var(--primary-container)" : "var(--surface-container-high)", fontFamily: "var(--font-display)", cursor: canSubmit && !isSubmitting ? "pointer" : "not-allowed" }} whileHover={canSubmit && !isSubmitting ? { scale: 1.02 } : {}} whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}>
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div key="loading" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : isSuccess ? (
                      <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <FlameIcon size={20} color="white" />
                      </motion.div>
                    ) : (
                      <motion.div key="idle" className="flex items-center gap-3">
                        <FlameIcon size={18} color="white" />
                        Thắp Nến Nguyện Cầu
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
              {isSuccess && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center py-3 px-4 rounded-xl" style={{ background: "rgba(242, 114, 32, 0.15)", border: "1px solid rgba(242, 114, 32, 0.3)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>✨ Nến của bạn đã được thắp lên!</p>
                <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>Lời nguyện đang bay đến HLE</p>
              </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="history" className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-extrabold mb-1" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "var(--primary-container)" }}>Lịch Sử Nguyện Cầu</h1>
            <p className="text-sm" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>Những lời nguyện đã được gửi đến HLE</p>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            <motion.aside initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="col-span-3 space-y-4">
              <div className="rounded-2xl p-5" style={{ background: "var(--surface-container)" }}>
                <h3 className="text-xs font-bold mb-4" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>THỐNG KÊ</h3>
                {[
                  { label: "Tổng lượt", value: 12405 },
                  { label: "Hôm nay", value: 8230 },
                  { label: "Tuần này", value: 54112 },
                  { label: "Tháng này", value: 198740 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2">
                    <span className="text-xs" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>{label}</span>
                    <span className="font-bold text-sm" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>{value.toLocaleString("vi-VN")}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--surface-container)" }}>
                <h3 className="text-xs font-bold mb-4 flex items-center gap-2" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}><Trophy size={12} />TOP SUPPORTERS</h3>
                {TOP_PRAYERS.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold w-5" style={{ color: i === 0 ? "var(--primary-container)" : "var(--tertiary)", fontFamily: "var(--font-display)" }}>#{i + 1}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: "var(--on-background)", fontFamily: "var(--font-body)" }}>{p.name}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>{p.count}</span>
                  </div>
                ))}
              </div>
            </motion.aside>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }} className="col-span-6">
              <h3 className="text-xs font-bold mb-4" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>TẤT CẢ LỜI NGUYỆN</h3>
              <div className="space-y-3">
                {allPrayers.map((prayer, i) => (
                  <motion.div key={prayer.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="rounded-2xl p-5 transition-all duration-300" style={{ background: "var(--surface-container)", border: "1px solid rgba(88, 66, 55, 0.08)" }} whileHover={{ borderColor: "rgba(242, 114, 32, 0.25)", boxShadow: "0 0 20px rgba(242, 114, 32, 0.08)" }}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <FlameIcon size={22} color={prayer.flameColor} animated />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm" style={{ color: "var(--on-background)", fontFamily: "var(--font-display)" }}>{prayer.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(242, 114, 32, 0.12)", color: "var(--primary-container)", fontFamily: "var(--font-body)" }}>đang cháy</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>{prayer.content}</p>
                        <p className="text-xs mt-2" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>{formatTime(prayer.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }} className="col-span-3 space-y-4">
              <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, rgba(242, 114, 32, 0.12) 0%, rgba(242, 114, 32, 0.04) 100%)", border: "1px solid rgba(242, 114, 32, 0.2)" }}>
                <div className="flex justify-center mb-3">
                  <FlameIcon size={48} color="#f27220" animated />
                </div>
                <p className="text-3xl font-extrabold mb-1" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>12,405</p>
                <p className="text-xs" style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}>nến đang cháy</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--surface-container)" }}>
                <h3 className="text-xs font-bold mb-4" style={{ color: "var(--tertiary)", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>HLE ROSTER 2025</h3>
                {[
                  { role: "TOP", name: "Zeus", real: "Choi Woo-je" },
                  { role: "JGL", name: "Peanut", real: "Han Wang-ho" },
                  { role: "MID", name: "Zeka", real: "Kim Geon-woo" },
                  { role: "ADC", name: "Viper", real: "Park Do-yeon" },
                  { role: "SUP", name: "Delight", real: "Young-woo" },
                ].map(({ role, name, real }) => (
                  <div key={name} className="flex items-center gap-3 py-2">
                    <span className="text-xs font-bold w-8" style={{ color: "var(--primary-container)", fontFamily: "var(--font-display)" }}>{role}</span>
                    <span className="text-sm font-semibold flex-1" style={{ color: "var(--on-background)", fontFamily: "var(--font-display)" }}>{name}</span>
                    <span className="text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>{real}</span>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs" style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}>
        © 2025 Hanwha Life Esports — Beyond the Challenge
      </footer>
    </div>
  );
}