import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { products, categories } from '../data/products';
import SectionHeading from './SectionHeading';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';

const ProductModal = lazy(() => import('./ProductModal'));

export default function AllProductsPage({ picksSet, onTogglePick, onBackHome, onGoCustom }) {
  const [active, setActive] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const shown = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  );

  const selectedProduct = selectedIndex !== null ? shown[selectedIndex] : null;

  const handleOpen = useCallback((idx) => {
    setSelectedIndex(idx);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setActive(cat);
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + shown.length) % shown.length));
  }, [shown.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % shown.length));
  }, [shown.length]);

  return (
    <section className="mx-auto min-h-[75vh] max-w-[1280px] px-[clamp(14px,4.5vw,64px)] pb-20 pt-6 sm:pb-24 sm:pt-10">
      {/* Back to home */}
      <div className="mb-5 sm:mb-7">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-ink/35 bg-cream px-4 py-2 text-[14.5px] font-medium text-ink transition-all duration-200 hover:-translate-x-0.5 hover:border-ink/65 hover:bg-blush/55 active:scale-95"
        >
          <span aria-hidden="true">←</span>
          <span>Back to home</span>
        </button>
      </div>

      <SectionHeading script="every last stitch" title="All products" className="mb-3 text-center" />
      <p className="mx-auto mb-6 max-w-[520px] text-center text-[15.5px] text-ink/80 sm:mb-8 sm:text-[17px]">
        Browse the full handmade collection. Tap the heart on anything you like to build your order list.
      </p>

      <CategoryFilter categories={categories} active={active} onChange={handleCategoryChange} />

      <p className="mb-5 text-center font-script text-[22px] font-semibold text-leaf sm:mb-7">
        Showing {shown.length} {shown.length === 1 ? 'piece' : 'pieces'}
        {active !== 'All' ? ` in ${active}` : ''}
      </p>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((p, idx) => (
          <ProductCard
            key={p.id}
            product={p}
            index={idx}
            isPicked={picksSet.has(p.id)}
            onTogglePick={onTogglePick}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {/* Helpful custom-order prompt at the bottom of the catalog */}
      <div className="mx-auto mt-14 max-w-[640px] rounded-[24px] border-2 border-dashed border-ink/30 bg-oat/75 px-6 py-8 text-center sm:mt-16 sm:px-10">
        <p className="font-script text-[26px] font-semibold text-cherry">looking for something specific?</p>
        <h2 className="mt-1 font-display text-[24px] font-bold leading-snug sm:text-[30px]">
          We also stitch custom ideas
        </h2>
        <p className="mt-2 text-[15.5px] text-ink/85">
          Pick a different colour, add a name, or share a reference picture and we will craft it for you.
        </p>
        <button
          type="button"
          onClick={onGoCustom}
          className="btn btn-sm btn-primary mt-5 cursor-pointer"
        >
          See how custom orders work
        </button>
      </div>

      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProduct}
            index={selectedIndex}
            total={shown.length}
            isPicked={picksSet.has(selectedProduct.id)}
            onTogglePick={onTogglePick}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Suspense>
      )}
    </section>
  );
}
