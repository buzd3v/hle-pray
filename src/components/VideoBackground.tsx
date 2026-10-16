export function VideoBackground() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0e0e0e]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hle_bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,14,14,0.55) 0%, rgba(14,14,14,0.72) 50%, rgba(14,14,14,0.85) 100%)",
        }}
      />
    </div>
  );
}
