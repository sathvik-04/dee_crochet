import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-[clamp(18px,5vw,64px)] pb-24 pt-8 text-center text-[14.5px] sm:justify-between sm:pb-10 sm:text-left sm:text-[15px]">
      <span className="flex items-center gap-2.5">
        <img src="/logo.png" alt="" width={28} height={28} loading="lazy" decoding="async" className="size-7 rounded-full object-cover ring-1 ring-ink/15" />
        <span>© {site.handle} · Handmade in {site.city}</span>
      </span>
      <a href={site.instagramUrl} target="_blank" rel="noreferrer" data-cursor="follow" className="font-medium transition-colors hover:text-cherry">
        Instagram
      </a>
    </footer>
  );
}
