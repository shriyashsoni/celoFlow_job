export function HeroMoneyStream() {
  const particles = [
    { top: '22%', delay: '0s', duration: '2.8s' },
    { top: '30%', delay: '0.6s', duration: '3.2s' },
    { top: '38%', delay: '1.2s', duration: '2.6s' },
    { top: '46%', delay: '0.3s', duration: '3.4s' },
    { top: '54%', delay: '0.9s', duration: '2.9s' },
    { top: '62%', delay: '1.5s', duration: '3.1s' },
    { top: '70%', delay: '0.2s', duration: '2.7s' },
  ];

  return (
    <div className="relative w-full max-w-[520px] h-[260px] sm:h-[360px] lg:h-[420px] rounded-2xl border border-[#1a1a1a] bg-[#030303] overflow-hidden shadow-[0_0_80px_rgba(255,214,0,0.08)]">
      <div className="money-stream-grid" />
      <div className="money-stream-glow" />

      <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-20 h-28 sm:w-24 sm:h-32 lg:w-28 lg:h-36 rounded-xl border border-[#FFD600]/40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,214,0,0.22)]">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#FFD600] text-black text-xs font-bold flex items-center justify-center">W</div>
        <div className="text-[11px] tracking-wider text-[#cccccc]">SENDER</div>
      </div>

      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-20 h-28 sm:w-24 sm:h-32 lg:w-28 lg:h-36 rounded-xl border border-[#FFD600]/40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,214,0,0.22)]">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#FFD600] text-black text-xs font-bold flex items-center justify-center">W</div>
        <div className="text-[11px] tracking-wider text-[#cccccc]">RECEIVER</div>
      </div>

      <div className="absolute left-[92px] right-[92px] sm:left-[112px] sm:right-[112px] lg:left-[128px] lg:right-[128px] top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#FFD600]/15 via-[#FFD600] to-[#FFD600]/15 blur-[0.3px]" />

      {particles.map((particle, idx) => (
        <span
          key={idx}
          className={`money-stream-particle ${idx > 3 ? 'hidden sm:block' : ''}`}
          style={{
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}