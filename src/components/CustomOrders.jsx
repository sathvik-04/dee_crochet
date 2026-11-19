import { site, steps } from '../data/site';
import SectionHeading from './SectionHeading';
import CrochetDivider from './CrochetDivider';

export default function CustomOrders() {
  return (
    <div id="custom" className="relative">
      <CrochetDivider topColor="#FBF3E4" bottomColor="#F3E3CF" stitchColor="#3B2418" />
      <section className="relative bg-oat px-[clamp(20px,5vw,64px)] py-20">
        <div className="mx-auto max-w-[1200px] text-center">
          <SectionHeading script="made just for you" title="Custom orders, made simple" />
          <p className="mx-auto mb-11 mt-3.5 max-w-[560px]">
            Want another colour, a name, or an idea of your own? Tell us and we will stitch it.
          </p>
          <div className="mb-11 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 text-left">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-[22px] border-2 border-dashed border-ink bg-cream p-7 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(59,36,24,0.1)]"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-cherry font-display text-[22px] font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-1.5 mt-4 font-display text-[22px] font-semibold">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <a href={site.dmUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Start a custom order
          </a>
        </div>
      </section>
      <CrochetDivider topColor="#FBF3E4" bottomColor="#F3E3CF" stitchColor="#3B2418" flip />
    </div>
  );
}
