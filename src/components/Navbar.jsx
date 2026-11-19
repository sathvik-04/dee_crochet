import { useEffect, useState } from 'react';
import { site } from '../data/site';

const NAV_LINKS = [
  { href: '/collection', id: 'collection', label: 'Collection', isPage: true },
  { href: '#custom', id: 'custom', label: 'Custom orders', isPage: false },
  { href: '#about', id: 'about', label: 'About', isPage: false },
];

export default function Navbar({ page = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let rafId = null;
    let lastScrolled = false;

    const updateScrolled = () => {
      const next = window.scrollY > 24;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setScrolled(next);
      }
      if (page === 'home' && window.scrollY < 140) {
        setActiveId('');
      }
      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateScrolled);
      }
    };

    updateScrolled();
    window.addEventListener('scroll', onScroll, { passive: true });

    let observer = null;
    if (page === 'home') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          }
        },
        { rootMargin: '-35% 0px -55% 0px' },
      );

      for (const item of NAV_LINKS) {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      }
    } else {
      setActiveId('collection');
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [page]);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setMenuOpen(false);
    if (link.isPage) {
      onNavigate('collection');
    } else {
      onNavigate('home', link.id);
    }
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate('home');
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 border-b border-dashed backdrop-blur-md transition-all duration-300 ${scrolled
        ? 'border-ink/25 bg-cream/95 shadow-[0_10px_28px_rgba(59,36,24,0.1)]'
        : 'border-ink/15 bg-cream/88 shadow-none'
        }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-2.5 px-4 py-3.5 sm:gap-4 sm:px-[clamp(18px,5vw,64px)] sm:py-3">
        {/* Brand lockup */}
        <a href="/" onClick={handleBrandClick} className="group flex min-w-0 items-center gap-2.5 pl-0.5">
          <img
            src="/logo.png"
            alt="deecrochet._ logo"
            className="size-10 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-blush transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[21px] font-bold leading-none tracking-tight sm:text-[24px]">
              deecrochet<span className="text-cherry">._</span>
            </span>
            <span className="hidden font-script text-[15px] font-semibold leading-none text-leaf sm:block">
              handmade crochet
            </span>
          </div>
        </a>

        {/* Desktop navigation links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[15.5px] font-medium transition-all duration-200 ${isActive
                  ? 'bg-blush/85 font-semibold text-cherry'
                  : 'text-ink/85 hover:bg-blush/55 hover:text-ink'
                  }`}
              >
                {isActive && <span className="size-1.5 rounded-full bg-cherry" aria-hidden="true" />}
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA + Mobile menu button */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={site.dmUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-cherry px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_6px_18px_rgba(185,31,51,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(185,31,51,0.36)] hover:brightness-105 active:translate-y-0 active:scale-95 sm:gap-2 sm:px-5 sm:text-[15px]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="hidden sm:inline">DM on Instagram</span>
            <span className="hidden min-[380px]:inline sm:hidden">DM us</span>
            <span className="min-[380px]:hidden">DM</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-dashed border-ink/25 bg-cream text-ink transition-colors hover:bg-blush/60 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 border-t border-dashed border-ink/15 bg-cream/95 px-[clamp(18px,5vw,64px)] py-3 shadow-[0_12px_28px_rgba(59,36,24,0.1)] backdrop-blur-md md:hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`rounded-2xl px-4 py-3 text-[16px] font-medium transition-colors ${isActive ? 'bg-blush/85 font-semibold text-cherry' : 'text-ink hover:bg-blush/50'
                  }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
