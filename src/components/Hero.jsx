import { products } from '../data/products';
import { site } from '../data/site';

const ring =
  'absolute aspect-[236/267] rounded-[22px] object-cover shadow-[0_0_0_8px_#fff,0_16px_32px_rgba(59,36,24,0.2)] transition-all duration-300 ease-out hover:z-20 hover:scale-[1.06] hover:rotate-0 hover:shadow-[0_0_0_8px_#fff,0_24px_42px_rgba(59,36,24,0.28)]';

const collage = [
  ['little-krishna', 'left-0 top-[12%] w-[52%] -rotate-5'],
  ['spider-man-keychain', 'right-0 top-[2%] w-[46%] rotate-4'],
  ['beagle-keychain', 'left-[30%] bottom-0 w-[46%] -rotate-2'],
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-10 px-[clamp(18px,5vw,64px)] pb-14 pt-6 md:flex-row md:gap-12 md:pb-[90px] md:pt-10"
    >
      <div className="w-full min-w-0 flex-1 text-center md:text-left">
        <p className="font-script text-[28px] font-semibold text-cherry sm:text-[34px]">handmade with love</p>
        <h1 className="mb-4 mt-1 font-display text-[length:clamp(36px,9.5vw,76px)] font-bold leading-[1.06] sm:mb-5 sm:mt-1.5">
          Tiny crochet things, made to go with you.
        </h1>
        <p className="mx-auto mb-7 max-w-[520px] text-[17px] sm:mb-8 sm:text-[19px] md:mx-0">
          Keychains, bag charms, bookmarks and bouquets. Each one is stitched by hand and made to order.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-3.5 md:justify-start">
          <a href="#collection" className="btn btn-primary w-full text-center sm:w-auto">See the collection</a>
          <a href={site.dmUrl} target="_blank" rel="noreferrer" className="btn btn-outline w-full text-center sm:w-auto">
            Order on Instagram
          </a>
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[310px] min-w-0 sm:max-w-[420px] md:mx-0 md:flex-1 lg:max-w-[500px]">
        {/* Dashed hand-stitched outer halo */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] sm:-inset-3 sm:h-[calc(100%+24px)] sm:w-[calc(100%+24px)]"
        >
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#3B2418"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.22"
          />
          {/* Hand-drawn sparkle stars */}
          <path d="M36 68 L40 58 L44 68 L54 72 L44 76 L40 86 L36 76 L26 72 Z" fill="none" stroke="#B91F33" strokeWidth="1.8" strokeLinejoin="round" opacity="0.7" />
          <path d="M366 312 L369 305 L372 312 L379 315 L372 318 L369 325 L366 318 L359 315 Z" fill="none" stroke="#3F5A2E" strokeWidth="1.8" strokeLinejoin="round" opacity="0.75" />
          {/* Loose yarn squiggle */}
          <path
            d="M14 318 C 32 300, 48 338, 66 322 C 78 310, 74 294, 62 300"
            fill="none"
            stroke="#B91F33"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>

        <div className="absolute left-[4%] top-[4%] h-[92%] w-[92%] rounded-full bg-blush" />

        {/* Handwritten curved arrow annotation */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-7 left-[12%] hidden sm:flex items-center gap-1 text-cherry/85">
          <span className="font-script text-[22px] font-semibold -rotate-6">stitched by hand!</span>
          <svg viewBox="0 0 44 26" className="h-6 w-10 translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6 C 18 2, 30 8, 36 21" />
            <path d="M29 18 L36 22 L39 14" />
          </svg>
        </div>

        {collage.map(([id, position]) => {
          const p = products.find((x) => x.id === id);
          return (
            <img
              key={id}
              src={p.image}
              alt={p.name}
              title={p.name}
              width={472}
              height={534}
              fetchPriority="high"
              decoding="async"
              className={`${ring} ${position} cursor-pointer`}
            />
          );
        })}
      </div>
    </section>
  );
}
