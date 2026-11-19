import { site } from '../data/site';

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-[clamp(20px,5vw,64px)] py-8 text-[15px]">
      <span className="flex items-center gap-2.5">
        <img src="/logo.png" alt="" className="size-7 rounded-full object-cover ring-1 ring-ink/15" />
        <span>© {site.handle} · Handmade in {site.city}</span>
      </span>
      <a href={site.instagramUrl} target="_blank" rel="noreferrer" data-cursor="follow" className="font-medium transition-colors hover:text-cherry">
        Instagram
      </a>
    </footer>
  );
}
