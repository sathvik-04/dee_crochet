import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { products } from '../data/products';
import SectionHeading from './SectionHeading';
import ProductCard from './ProductCard';

const ProductModal = lazy(() => import('./ProductModal'));

const FEATURED_COUNT = 8;

export default function Collection({ picksSet, onTogglePick, onSeeAll }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const featured = useMemo(() => products.slice(0, FEATURED_COUNT), []);
  const selectedProduct = selectedIndex !== null ? featured[selectedIndex] : null;

  const handleOpen = useCallback((idx) => {
    setSelectedIndex(idx);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + featured.length) % featured.length));
  }, [featured.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % featured.length));
  }, [featured.length]);

  return (
    <section id="collection" className="mx-auto max-w-[1280px] px-[clamp(14px,4.5vw,64px)] pb-16 pt-6 sm:pb-[90px] sm:pt-8">
      <SectionHeading script="pick a favourite" title="The collection" className="mb-7 text-center sm:mb-9" />

      <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {featured.map((p, idx) => (
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

      {/* See all products button -> opens dedicated All Products page */}
      <div className="mt-10 text-center sm:mt-12">
        <button
          type="button"
          onClick={onSeeAll}
          className="btn btn-primary inline-flex cursor-pointer items-center gap-2"
        >
          <span>See all products ({products.length})</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProduct}
            index={selectedIndex}
            total={featured.length}
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
