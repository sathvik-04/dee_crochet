import { memo, useEffect, useRef, useState, useCallback } from 'react';

const YARN_COLORS = [
  { name: 'cherry', hex: '#B91F33' },
  { name: 'leaf', hex: '#3F5A2E' },
  { name: 'espresso', hex: '#3B2418' },
  { name: 'terracotta', hex: '#C45B38' },
];

const BURST_VECTORS = [
  { tx: '-22px', ty: '-24px', symbol: '♥' },
  { tx: '24px', ty: '-20px', symbol: '✦' },
  { tx: '-18px', ty: '20px', symbol: '·' },
  { tx: '20px', ty: '18px', symbol: '♥' },
];

const RING_CIRCUMFERENCE = 2 * Math.PI * 19;

const LEFT_YARN_PATH =
  'M 36,0 C 58,90 12,170 40,260 C 56,310 18,325 22,292 C 26,264 62,285 42,360 C 18,450 60,540 34,640 C 12,725 56,810 38,910 C 26,970 58,995 50,960 C 44,932 14,958 34,1040 C 56,1130 16,1230 42,1330 C 60,1400 20,1485 38,1600';

const RIGHT_YARN_PATH =
  'M 44,0 C 20,110 62,200 36,300 C 16,375 56,410 52,372 C 48,342 14,368 38,450 C 62,535 18,630 44,740 C 64,825 22,920 42,1020 C 56,1085 20,1108 26,1072 C 32,1042 64,1070 42,1160 C 18,1255 60,1360 36,1470 C 22,1530 50,1565 40,1600';

const MarginCharm = memo(function MarginCharm({
  side,
  top,
  label,
  activeNote,
  animType = 'wiggle',
  onInteract,
  delay = '0s',
  accentColor,
  children,
}) {
  const [animating, setAnimating] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [pinned, setPinned] = useState(false);

  const handleClick = () => {
    setAnimating(false);
    requestAnimationFrame(() => setAnimating(true));
    setBurstKey((k) => k + 1);
    setPinned((p) => !p);
    onInteract?.();
    setTimeout(() => setAnimating(false), 680);
  };

  const animClass = animating
    ? animType === 'spin'
      ? 'animate-yarn-spin-pop'
      : animType === 'snip'
        ? 'snip-active'
        : 'animate-yarn-wiggle'
    : '';

  return (
    <div
      className={`pointer-events-auto absolute z-20 hidden xl:flex flex-col items-center ${
        side === 'left' ? 'left-2 2xl:left-7' : 'right-2 2xl:right-7'
      }`}
      style={{ top }}
    >
      <div className="animate-yarn-float group relative" style={{ animationDelay: delay }}>
        <button
          type="button"
          onClick={handleClick}
          aria-label={label}
          title={label}
          className={`relative flex size-14 cursor-pointer items-center justify-center rounded-full border border-dashed border-ink/25 bg-cream/90 text-ink shadow-[0_4px_14px_rgba(59,36,24,0.08)] transition-all duration-300 hover:scale-110 hover:border-ink/55 hover:bg-cream hover:shadow-[0_8px_20px_rgba(59,36,24,0.14)] 2xl:size-16 ${animClass}`}
        >
          {children}

          {burstKey > 0 && (
            <span key={burstKey} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {BURST_VECTORS.map((v, idx) => (
                <span
                  key={idx}
                  className="animate-stitch-burst absolute text-xs font-bold"
                  style={{ '--tx': v.tx, '--ty': v.ty, color: accentColor }}
                >
                  {v.symbol}
                </span>
              ))}
            </span>
          )}
        </button>

        <span
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-dashed border-ink/30 bg-cream/95 px-2.5 py-0.5 font-script text-[18px] font-semibold leading-tight text-ink shadow-sm transition-all duration-200 ${
            side === 'left' ? 'left-[calc(100%+8px)]' : 'right-[calc(100%+8px)]'
          } ${
            pinned
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
          }`}
        >
          {activeNote}
        </span>
      </div>
    </div>
  );
});

export default function SideYarnDecor() {
  const [colorIdx, setColorIdx] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [snips, setSnips] = useState(0);

  const leftPathRef = useRef(null);
  const rightPathRef = useRef(null);
  const ringRef = useRef(null);
  const arrowRef = useRef(null);
  const labelRef = useRef(null);
  const progressRef = useRef(0);

  const currentYarn = YARN_COLORS[colorIdx];

  // Zero-re-render scroll progress updates via direct DOM refs
  useEffect(() => {
    let rafId = null;

    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const clamped = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      progressRef.current = clamped;

      const drawAmount = Math.min(1, 0.06 + clamped * 0.94);
      const dashOffset = (1 - drawAmount).toFixed(4);

      if (leftPathRef.current) leftPathRef.current.style.strokeDashoffset = dashOffset;
      if (rightPathRef.current) rightPathRef.current.style.strokeDashoffset = dashOffset;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = (RING_CIRCUMFERENCE * (1 - clamped)).toFixed(2);
      }

      const atBottom = clamped > 0.85;
      if (arrowRef.current) arrowRef.current.textContent = atBottom ? '↑' : '↓';
      if (labelRef.current) {
        labelRef.current.textContent = atBottom ? 'all stitched!' : `${Math.round(clamped * 100)}% stitched`;
      }

      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const cycleYarnColor = useCallback(() => {
    setColorIdx((i) => (i + 1) % YARN_COLORS.length);
  }, []);

  const incrementHearts = useCallback(() => {
    setHearts((h) => h + 1);
  }, []);

  const incrementSnips = useCallback(() => {
    setSnips((s) => s + 1);
  }, []);

  const handleTrackerClick = () => {
    const sections = ['top', 'collection', 'custom', 'about'];
    if (progressRef.current > 0.85) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const currentY = window.scrollY + 120;
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.offsetTop > currentY) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="false">
        {/* LEFT YARN RAIL */}
        <svg
          aria-hidden="true"
          viewBox="0 0 80 1600"
          preserveAspectRatio="none"
          className="hidden lg:block absolute left-0 top-0 h-full w-[52px] xl:w-[68px] 2xl:w-[100px]"
        >
          <path
            d={LEFT_YARN_PATH}
            fill="none"
            stroke="#3B2418"
            strokeWidth="1.5"
            strokeDasharray="4 7"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            ref={leftPathRef}
            d={LEFT_YARN_PATH}
            fill="none"
            stroke={currentYarn.hex}
            strokeWidth="2.4"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="0.94"
            opacity="0.65"
            style={{ transition: 'stroke 0.35s ease' }}
          />
        </svg>

        {/* RIGHT YARN RAIL */}
        <svg
          aria-hidden="true"
          viewBox="0 0 80 1600"
          preserveAspectRatio="none"
          className="hidden lg:block absolute right-0 top-0 h-full w-[52px] xl:w-[68px] 2xl:w-[100px]"
        >
          <path
            d={RIGHT_YARN_PATH}
            fill="none"
            stroke="#3B2418"
            strokeWidth="1.5"
            strokeDasharray="4 7"
            strokeLinecap="round"
            opacity="0.16"
          />
          <path
            ref={rightPathRef}
            d={RIGHT_YARN_PATH}
            fill="none"
            stroke={currentYarn.hex}
            strokeWidth="2.4"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="0.94"
            opacity="0.65"
            style={{ transition: 'stroke 0.35s ease' }}
          />
        </svg>

        {/* 1. LEFT TOP (Hero): Interactive Yarn Ball */}
        <MarginCharm
          side="left"
          top="7%"
          label="Click to change yarn thread colour"
          activeNote={`${currentYarn.name} yarn!`}
          animType="spin"
          onInteract={cycleYarnColor}
          delay="0s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="24" r="14" stroke={currentYarn.hex} fill="#F3D9CC" fillOpacity="0.45" />
            <path d="M12 18c7 1 15 6 22 14" stroke={currentYarn.hex} />
            <path d="M10 25c8-2 16 1 25 8" stroke={currentYarn.hex} />
            <path d="M17 11c2 9 1 17-3 25" />
            <path d="M24 10c2 9 1 18-3 27" />
            <path d="M31 13c1 7 0 14-3 21" />
            <path d="M35 33c4 3 7 3 10 1" stroke={currentYarn.hex} strokeDasharray="3 2" />
          </svg>
        </MarginCharm>

        {/* 2. RIGHT UPPER: Interactive Crochet Daisy */}
        <MarginCharm
          side="right"
          top="15%"
          label="Crochet daisy charm"
          activeNote="100% cotton"
          animType="spin"
          delay="0.8s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <g stroke="#3B2418" fill="#FBF3E4">
              <ellipse cx="24" cy="12" rx="4.2" ry="7.2" />
              <ellipse cx="24" cy="36" rx="4.2" ry="7.2" />
              <ellipse cx="12" cy="24" rx="7.2" ry="4.2" />
              <ellipse cx="36" cy="24" rx="7.2" ry="4.2" />
              <ellipse cx="15.5" cy="15.5" rx="4" ry="6.5" transform="rotate(-45 15.5 15.5)" />
              <ellipse cx="32.5" cy="32.5" rx="4" ry="6.5" transform="rotate(-45 32.5 32.5)" />
              <ellipse cx="32.5" cy="15.5" rx="4" ry="6.5" transform="rotate(45 32.5 15.5)" />
              <ellipse cx="15.5" cy="32.5" rx="4" ry="6.5" transform="rotate(45 15.5 32.5)" />
            </g>
            <circle cx="24" cy="24" r="5.5" fill={currentYarn.hex} stroke="#3B2418" />
          </svg>
        </MarginCharm>

        {/* 3. LEFT MID: Interactive Stitch Marker & Heart */}
        <MarginCharm
          side="left"
          top="31%"
          label="Send a little love"
          activeNote={hearts > 0 ? `hand-stitched ♥ ×${hearts}` : 'hand-stitched!'}
          animType="wiggle"
          onInteract={incrementHearts}
          delay="1.4s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 7c3.5 0 6 2.6 6 6 0 2.5-1.4 4.5-3.4 5.5" />
            <path d="M24 7c-3.5 0-6 2.6-6 6v4" />
            <path
              d="M24 39s-11-6.8-11-14.2c0-3.8 2.9-6.6 6.4-6.6 2.1 0 3.7 1.1 4.6 2.6.9-1.5 2.5-2.6 4.6-2.6 3.5 0 6.4 2.8 6.4 6.6C35 32.2 24 39 24 39Z"
              fill={currentYarn.hex}
              fillOpacity="0.2"
              stroke={currentYarn.hex}
            />
            <path d="M19 25c1.5 1.5 3.5 1.5 5 0" stroke={currentYarn.hex} strokeWidth="1.5" />
          </svg>
        </MarginCharm>

        {/* 4. RIGHT MID: Interactive Crochet Hook */}
        <MarginCharm
          side="right"
          top="45%"
          label="Handmade crochet hook"
          activeNote="made to order"
          animType="wiggle"
          delay="0.4s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 37L33 15c2-2 5-2 6.5-.5s1 4.2-1 5.5c-1.5 1-3.2.5-3.5-1" />
            <path d="M13 35l7-7" strokeWidth="5.5" stroke="#F3D9CC" />
            <path d="M13 35l7-7" strokeWidth="2.2" stroke="#3B2418" />
            <path d="M28 13c-3-4-9-2-8 3 1 4 8 3 12 8" stroke={currentYarn.hex} strokeWidth="1.8" strokeDasharray="3 2.5" />
          </svg>
        </MarginCharm>

        {/* 5. LEFT LOWER-MID: Interactive Embroidery Scissors */}
        <MarginCharm
          side="left"
          top="62%"
          label="Snip the yarn"
          activeNote={snips > 0 ? `snip! ×${snips}` : 'custom colours?'}
          animType="snip"
          onInteract={incrementSnips}
          delay="1.1s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <g className="scissor-top">
              <circle cx="13" cy="15" r="4.5" stroke={currentYarn.hex} />
              <path d="M17 17.5L37 31" />
            </g>
            <g className="scissor-bottom">
              <circle cx="13" cy="33" r="4.5" stroke={currentYarn.hex} />
              <path d="M17 30.5L37 17" />
            </g>
            <circle cx="24" cy="24" r="1.6" fill="#3B2418" />
          </svg>
        </MarginCharm>

        {/* 6. RIGHT LOWER: Interactive Crochet Tulip & Leaf Sprig */}
        <MarginCharm
          side="right"
          top="74%"
          label="Botanical crochet tulip"
          activeNote="stitched slow"
          animType="wiggle"
          delay="1.9s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 25v15" stroke="#3F5A2E" />
            <path d="M24 35c-5-1-9-4-10-9 5 0 9 3 10 9Z" fill="#3F5A2E" fillOpacity="0.22" stroke="#3F5A2E" />
            <path d="M24 33c5-1 8-4 9-8-4 0-8 3-9 8Z" fill="#3F5A2E" fillOpacity="0.22" stroke="#3F5A2E" />
            <path
              d="M16 14c0 7 3.5 11 8 11s8-4 8-11l-4 4-4-5-4 5-4-4Z"
              fill={currentYarn.hex}
              fillOpacity="0.24"
              stroke={currentYarn.hex}
            />
          </svg>
        </MarginCharm>

        {/* 7. LEFT BOTTOM: Interactive Wooden Button */}
        <MarginCharm
          side="left"
          top="85%"
          label="Wooden crochet button"
          activeNote="say hi on ig!"
          animType="spin"
          delay="0.6s"
          accentColor={currentYarn.hex}
        >
          <svg viewBox="0 0 48 48" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="24" cy="24" r="14" fill="#F3E3CF" stroke="#3B2418" />
            <circle cx="24" cy="24" r="10.5" stroke="#3B2418" strokeDasharray="2.5 3" opacity="0.55" />
            <circle cx="20" cy="20" r="1.4" fill="#3B2418" />
            <circle cx="28" cy="20" r="1.4" fill="#3B2418" />
            <circle cx="20" cy="28" r="1.4" fill="#3B2418" />
            <circle cx="28" cy="28" r="1.4" fill="#3B2418" />
            <path d="M20 20L28 28M28 20L20 28" stroke={currentYarn.hex} strokeWidth="2" />
          </svg>
        </MarginCharm>
      </div>

      {/* Fixed Bottom-Right Mini Stitch Progress Tracker */}
      <button
        type="button"
        onClick={handleTrackerClick}
        aria-label="Jump to next section or back to top"
        className="group fixed bottom-5 right-4 z-30 hidden md:flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-ink/30 bg-cream/95 py-1.5 pl-2 pr-3.5 text-ink shadow-[0_8px_22px_rgba(59,36,24,0.12)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-ink/60 active:scale-95"
      >
        <span className="relative flex size-10 items-center justify-center">
          <svg viewBox="0 0 44 44" className="size-10 -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="#3B2418"
              strokeOpacity="0.14"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
            <circle
              ref={ringRef}
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke={currentYarn.hex}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE}
              style={{ transition: 'stroke 0.35s ease' }}
            />
          </svg>
          <span
            ref={arrowRef}
            className="absolute text-sm font-bold transition-transform duration-200 group-hover:scale-110"
            style={{ color: currentYarn.hex }}
          >
            ↓
          </span>
        </span>
        <span ref={labelRef} className="font-script text-[20px] font-semibold leading-none text-ink">
          0% stitched
        </span>
      </button>
    </>
  );
}
