import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { products, categories } from '../data/products';
import SectionHeading from './SectionHeading';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import PicksTray from './PicksTray';

const ProductModal = lazy(() => import('./ProductModal'));

const STORAGE_KEY = 'deecrochet_picks';

export default function Collection() {
  const [active, setActive] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [picks, setPicks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((id) => products.some((p) => p.id === id)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
    } catch {
      // Ignore storage quota / privacy errors
    }
  }, [picks]);

  const shown = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  );

  const picksSet = useMemo(() => new Set(picks), [picks]);

  const pickedProducts = useMemo(
    () => picks.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [picks],
  );

  const selectedProduct = selectedIndex !== null ? shown[selectedIndex] : null;

  const togglePick = useCallback((id) => {
    setPicks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

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

  const handleClear = useCallback(() => {
    setPicks([]);
  }, []);

  return (
    <section id="collection" className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[90px] pt-8">
      <SectionHeading script="pick a favourite" title="The collection" className="mb-7 text-center" />
      <CategoryFilter categories={categories} active={active} onChange={handleCategoryChange} />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {shown.map((p, idx) => (
          <ProductCard
            key={p.id}
            product={p}
            index={idx}
            isPicked={picksSet.has(p.id)}
            onTogglePick={togglePick}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductModal
            product={selectedProduct}
            index={selectedIndex}
            total={shown.length}
            isPicked={picksSet.has(selectedProduct.id)}
            onTogglePick={togglePick}
            onClose={handleClose}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Suspense>
      )}

      <PicksTray
        pickedProducts={pickedProducts}
        onRemove={togglePick}
        onClear={handleClear}
      />
    </section>
  );
}
