import { site } from '../data/site';
import SectionHeading from './SectionHeading';

export default function About() {
  return (
    <section
      id="about"
      className="relative mx-auto flex max-w-[1100px] flex-wrap items-center gap-14 px-[clamp(20px,5vw,64px)] py-[90px]"
    >
      {/* Replace this box with <img src="/maker.jpg" alt="..." className="..." /> */}
      <div className="relative flex aspect-[4/5] max-w-[420px] flex-[1_1_300px] items-center justify-center rounded-t-[200px] rounded-b-[24px] border-2 border-dashed border-ink bg-blush p-6 text-center">
        [MAKER PHOTO]
        {/* Hand-drawn stitched flower & yarn curl accent on frame corner */}
        <svg
          aria-hidden="true"
          viewBox="0 0 90 90"
          className="pointer-events-none absolute -bottom-6 -right-6 size-20 text-leaf"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 74 C 34 62, 46 44, 52 22" />
          <path d="M36 56 C 24 54, 18 44, 22 36 C 32 38, 38 46, 36 56 Z" fill="#3F5A2E" fillOpacity="0.16" />
          <path d="M44 42 C 56 44, 66 38, 68 28 C 56 26, 48 32, 44 42 Z" fill="#3F5A2E" fillOpacity="0.16" />
          <circle cx="54" cy="18" r="5" fill="#B91F33" fillOpacity="0.25" stroke="#B91F33" />
          <circle cx="54" cy="18" r="1.5" fill="#B91F33" />
        </svg>
      </div>
      <div className="min-w-0 flex-[1_1_360px]">
        <SectionHeading script="hello!" title="Behind the stitches" className="mb-4" />
        <p>{site.story}</p>
      </div>
    </section>
  );
}
