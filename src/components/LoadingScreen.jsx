import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [phase, setPhase] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'done';
    }
    return 'visible';
  });

  useEffect(() => {
    if (phase === 'done') return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let minDone = false;
    let pageReady = document.readyState === 'complete';
    let fontsReady = !document.fonts;
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      document.body.style.overflow = prevOverflow;
      setPhase('fading');
      setTimeout(() => setPhase('done'), 420);
    };

    const tryDismiss = () => {
      if (minDone && pageReady && fontsReady) dismiss();
    };

    const minTimer = setTimeout(() => {
      minDone = true;
      tryDismiss();
    }, 850);

    // Safety cap so slow external resources never trap the loader
    const maxTimer = setTimeout(dismiss, 1600);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        tryDismiss();
      });
    }

    const onLoad = () => {
      pageReady = true;
      tryDismiss();
    };

    if (!pageReady) {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', onLoad);
      document.body.style.overflow = prevOverflow;
    };
  }, [phase === 'done']);

  if (phase === 'done') return null;

  const fading = phase === 'fading';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading deecrochet._"
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-cream transition-all duration-500 ease-out ${
        fading ? 'pointer-events-none scale-[1.02] opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle stitched inner frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[28px] border-2 border-dashed border-ink/15 sm:inset-6"
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Logo surrounded by rotating dashed stitch ring + live cherry yarn ring */}
        <div className="relative flex size-36 items-center justify-center">
          {/* Outer slowly spinning dashed stitch ring with tiny cherry yarn knot */}
          <svg
            aria-hidden="true"
            viewBox="0 0 144 144"
            className="animate-loader-spin absolute inset-0 size-full"
          >
            <circle
              cx="72"
              cy="72"
              r="65"
              fill="none"
              stroke="#3B2418"
              strokeOpacity="0.22"
              strokeWidth="1.8"
              strokeDasharray="6 7"
              strokeLinecap="round"
            />
            {/* Orbiting mini cherry yarn ball */}
            <circle cx="72" cy="7" r="5" fill="#B91F33" stroke="#FBF3E4" strokeWidth="1.5" />
          </svg>

          {/* Cherry yarn progress ring drawing around logo */}
          <svg
            aria-hidden="true"
            viewBox="0 0 144 144"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx="72"
              cy="72"
              r="55"
              fill="none"
              stroke="#F3D9CC"
              strokeWidth="3"
            />
            <circle
              cx="72"
              cy="72"
              r="55"
              fill="none"
              stroke="#B91F33"
              strokeWidth="3.2"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              className="animate-loader-stitch"
            />
          </svg>

          {/* Brand Logo */}
          <img
            src="/logo.png"
            alt="deecrochet._"
            width={96}
            height={96}
            fetchPriority="high"
            className="relative size-24 rounded-full object-cover shadow-[0_10px_24px_rgba(59,36,24,0.18)] ring-4 ring-cream"
          />
        </div>

        {/* Brand name */}
        <p className="mt-5 font-display text-[30px] font-bold leading-none tracking-tight text-ink">
          deecrochet<span className="text-cherry">._</span>
        </p>

        {/* Handwritten tagline */}
        <p className="mt-1.5 font-script text-[24px] font-semibold text-leaf">
          stitching things together...
        </p>

        {/* Delicate wavy crochet stitch progress line */}
        <svg
          aria-hidden="true"
          viewBox="0 0 180 18"
          className="mt-3 h-4 w-44"
          fill="none"
        >
          <path
            d="M4 9 Q 16 2, 28 9 T 52 9 T 76 9 T 100 9 T 124 9 T 148 9 T 176 9"
            stroke="#3B2418"
            strokeOpacity="0.16"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
          <path
            d="M4 9 Q 16 2, 28 9 T 52 9 T 76 9 T 100 9 T 124 9 T 148 9 T 176 9"
            stroke="#B91F33"
            strokeWidth="2.4"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            className="animate-loader-stitch"
          />
        </svg>
      </div>
    </div>
  );
}
