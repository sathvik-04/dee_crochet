import { useEffect, useRef, useState } from 'react';

const TRAIL_POINTS = 14;
const CURSOR_LABELS = {
  view: 'View',
  follow: 'Follow',
};

export default function YarnCursor() {
  const [enabled, setEnabled] = useState(false);

  const ballRef = useRef(null);
  const labelBallRef = useRef(null);
  const labelTextRef = useRef(null);
  const segmentRefs = useRef([]);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('yarn-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let lastX = -100;
    let lastY = -100;
    let spinAngle = 0;

    let visible = false;
    let overNative = false;
    let hoveringInteractive = false;
    let activeLabel = '';
    let pressing = false;

    const points = Array.from({ length: TRAIL_POINTS }, () => ({ x: -100, y: -100 }));
    let rafId = null;
    let scrollCheckQueued = false;

    const wake = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const inspectTarget = (el) => {
      if (!el || el.nodeType !== 1) {
        overNative = false;
        hoveringInteractive = false;
        activeLabel = '';
        return;
      }

      if (el.closest('textarea, input, [data-cursor="native"]')) {
        overNative = true;
        hoveringInteractive = false;
        activeLabel = '';
        return;
      }
      overNative = false;

      const labelledEl = el.closest('[data-cursor]');
      const labelKey = labelledEl?.getAttribute('data-cursor') || '';

      if (labelKey === 'view' && el.closest('button, a')) {
        activeLabel = '';
        hoveringInteractive = true;
        return;
      }

      if (labelKey && CURSOR_LABELS[labelKey]) {
        activeLabel = CURSOR_LABELS[labelKey];
        hoveringInteractive = false;
        return;
      }

      activeLabel = '';
      hoveringInteractive = Boolean(el.closest('a, button, [role="button"], select'));
    };

    const recheckUnderPointer = () => {
      if (!visible) return;
      inspectTarget(document.elementFromPoint(mouseX, mouseY));
      wake();
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        curX = mouseX;
        curY = mouseY;
        lastX = mouseX;
        lastY = mouseY;
        for (let i = 0; i < points.length; i++) {
          points[i].x = mouseX;
          points[i].y = mouseY;
        }
      } else {
        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        spinAngle += Math.hypot(dx, dy) * 0.45;
        lastX = mouseX;
        lastY = mouseY;
      }

      inspectTarget(e.target);
      wake();
    };

    const onMouseDown = () => {
      pressing = true;
      wake();
    };

    const onMouseUp = () => {
      pressing = false;
      requestAnimationFrame(recheckUnderPointer);
      wake();
    };

    const onScroll = () => {
      if (!visible || scrollCheckQueued) return;
      scrollCheckQueued = true;
      requestAnimationFrame(() => {
        scrollCheckQueued = false;
        recheckUnderPointer();
      });
    };

    const onMouseLeave = () => {
      visible = false;
      wake();
    };

    const onMouseEnter = () => {
      visible = true;
      wake();
    };

    const animate = () => {
      rafId = null;

      const paused = document.documentElement.classList.contains('yarn-cursor-paused');
      const active = visible && !overNative && !paused;

      curX += (mouseX - curX) * 0.34;
      curY += (mouseY - curY) * 0.34;

      const hasLabel = Boolean(activeLabel);

      // 1. Small cherry-red yarn ball
      if (ballRef.current) {
        const showSmall = active && !hasLabel;
        const baseScale = hoveringInteractive ? 1.45 : 1;
        const scaleX = pressing ? baseScale * 1.16 : baseScale;
        const scaleY = pressing ? baseScale * 0.82 : baseScale;

        ballRef.current.style.opacity = showSmall ? '1' : '0';
        ballRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}) rotate(${spinAngle.toFixed(1)}deg)`;
      }

      // 2. Expanded labelled yarn ball ("View" or "Follow")
      if (labelBallRef.current) {
        const showLabel = active && hasLabel;
        const scaleX = pressing ? 1.08 : showLabel ? 1 : 0.45;
        const scaleY = pressing ? 0.86 : showLabel ? 1 : 0.45;

        labelBallRef.current.style.opacity = showLabel ? '1' : '0';
        labelBallRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      }

      if (labelTextRef.current && hasLabel && labelTextRef.current.textContent !== activeLabel) {
        labelTextRef.current.textContent = activeLabel;
      }

      // 3. Tapering trailing yarn thread
      let trailMoving = false;
      if (active) {
        points[0].x += (mouseX - points[0].x) * 0.48;
        points[0].y += (mouseY - points[0].y) * 0.48;

        for (let i = 1; i < points.length; i++) {
          const dx = points[i - 1].x - points[i].x;
          const dy = points[i - 1].y - points[i].y;
          points[i].x += dx * 0.36;
          points[i].y += dy * 0.36;
          if (Math.abs(dx) > 0.12 || Math.abs(dy) > 0.12) {
            trailMoving = true;
          }
        }

        for (let i = 0; i < points.length - 1; i++) {
          const line = segmentRefs.current[i];
          if (!line) continue;
          const p0 = points[i];
          const p1 = points[i + 1];
          const t = 1 - i / (points.length - 1);
          line.setAttribute('x1', p0.x.toFixed(1));
          line.setAttribute('y1', p0.y.toFixed(1));
          line.setAttribute('x2', p1.x.toFixed(1));
          line.setAttribute('y2', p1.y.toFixed(1));
          line.setAttribute('stroke-width', (0.55 + t * 2.55).toFixed(2));
          line.style.opacity = (t * 0.78).toFixed(2);
        }
      } else {
        for (let i = 0; i < points.length - 1; i++) {
          const line = segmentRefs.current[i];
          if (line) line.style.opacity = '0';
        }
      }

      // Keep running only while still converging; sleep when idle for 0% CPU
      const ballMoving = Math.abs(mouseX - curX) > 0.15 || Math.abs(mouseY - curY) > 0.15;
      if (active && (trailMoving || ballMoving)) {
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.documentElement.classList.remove('yarn-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* Tapering trailing yarn thread */}
      <svg className="h-full w-full">
        {Array.from({ length: TRAIL_POINTS - 1 }).map((_, i) => (
          <line
            key={i}
            ref={(el) => {
              segmentRefs.current[i] = el;
            }}
            stroke="#B91F33"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
        ))}
      </svg>

      {/* Small cherry-red yarn ball pointer */}
      <div
        ref={ballRef}
        className="fixed left-0 top-0 -ml-[10px] -mt-[10px] transition-[opacity] duration-150"
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="drop-shadow-[0_2px_5px_rgba(59,36,24,0.28)]"
        >
          <circle cx="12" cy="12" r="9.5" fill="#B91F33" stroke="#FBF3E4" strokeWidth="1.8" />
          <path d="M5.5 8.5c4.5.8 9.5 3.6 13.2 8.2" stroke="#FBF3E4" strokeOpacity="0.65" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M4.6 12.8c4.8-1.2 10 .8 14.5 4.8" stroke="#FBF3E4" strokeOpacity="0.65" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9.5 3.8c1.2 5.2.6 10.6-1.8 15.8" stroke="#FBF3E4" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M14.2 3.8c1.1 5 .4 10.2-1.8 15.6" stroke="#FBF3E4" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Expanded textured cherry yarn ball labelled "View" or "Follow" */}
      <div
        ref={labelBallRef}
        className="fixed left-0 top-0 -ml-[34px] -mt-[34px] flex size-[68px] items-center justify-center transition-[opacity] duration-200"
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      >
        <svg
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          className="absolute inset-0 drop-shadow-[0_8px_18px_rgba(59,36,24,0.3)]"
        >
          <circle cx="34" cy="34" r="31" fill="#B91F33" stroke="#FBF3E4" strokeWidth="2.5" />
          <path d="M10 22c14 2 30 11 44 25" stroke="#FBF3E4" strokeOpacity="0.32" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7 33c16-3 32 3 49 16" stroke="#FBF3E4" strokeOpacity="0.32" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 45c14-4 28-2 42 7" stroke="#FBF3E4" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M22 7c5 17 3 35-5 52" stroke="#FBF3E4" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M35 5c5 17 3 36-5 56" stroke="#FBF3E4" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M47 9c4 15 2 31-5 47" stroke="#FBF3E4" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span
          ref={labelTextRef}
          className="relative font-script text-[24px] font-semibold tracking-wide text-white"
        >
          View
        </span>
      </div>
    </div>
  );
}
