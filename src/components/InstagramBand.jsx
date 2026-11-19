import { site } from '../data/site';
import CrochetDivider from './CrochetDivider';

export default function InstagramBand() {
  return (
    <div className="relative">
      <CrochetDivider topColor="#FBF3E4" bottomColor="#B91F33" stitchColor="#FBF3E4" />
      <section className="bg-cherry px-[clamp(18px,5vw,64px)] py-12 text-center text-white sm:py-16">
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer"
          data-cursor="follow"
          aria-label={`Visit @${site.handle} on Instagram`}
          className="group mb-5 inline-flex flex-col items-center gap-2"
        >
          <span className="rounded-full border-2 border-dashed border-cream/65 p-1.5 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/logo.png"
              alt={`@${site.handle} Instagram profile picture`}
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className="size-24 rounded-full object-cover shadow-[0_10px_28px_rgba(59,36,24,0.35)] ring-4 ring-cream"
            />
          </span>
          <span className="font-script text-[24px] font-semibold text-cream/95">@{site.handle}</span>
        </a>
        <h2 className="mb-2.5 font-display text-[length:clamp(30px,4vw,46px)] font-bold leading-[1.15]">
          See what is new on Instagram
        </h2>
        <p className="mb-7">Follow along for new pieces, behind-the-scenes and tutorials.</p>
        <a href={site.instagramUrl} target="_blank" rel="noreferrer" data-cursor="follow" className="btn btn-light">
          Follow @{site.handle}
        </a>
      </section>
    </div>
  );
}
