import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';

export default function ProductModal({
  product,
  index,
  total,
  isPicked,
  onTogglePick,
  onClose,
  onPrev,
  onNext,
}) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const touchStartX = useRef(null);

  // Reset gallery to cover photo whenever switching to another product
  useEffect(() => {
    setMediaIndex(0);
  }, [product?.id]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('yarn-cursor-paused');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove('yarn-cursor-paused');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  if (!product) return null;

  const mediaList = product.media?.length ? product.media : [{ type: 'image', src: product.image }];
  const safeMediaIndex = Math.min(mediaIndex, mediaList.length - 1);
  const activeMedia = mediaList[safeMediaIndex];
  const hasMultipleMedia = mediaList.length > 1;

  const prevMedia = () => setMediaIndex((i) => (i - 1 + mediaList.length) % mediaList.length);
  const nextMedia = () => setMediaIndex((i) => (i + 1) % mediaList.length);

  const handleTouchStart = (e) => {
    if (!hasMultipleMedia) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!hasMultipleMedia || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextMedia();
      else prevMedia();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-3 backdrop-blur-[2px] sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92dvh] w-full max-w-[820px] grid-cols-1 items-center gap-4 overflow-y-auto rounded-[24px] bg-cream p-4 shadow-[0_28px_70px_rgba(59,36,24,0.35)] sm:gap-7 sm:rounded-[28px] sm:p-8 md:grid-cols-[1.05fr_1fr]"
      >
        {/* Top-right Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product preview"
          className="absolute right-3 top-3 z-20 flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink/60 bg-cream/95 text-lg leading-none text-ink shadow-md transition-colors hover:bg-blush sm:right-4 sm:top-4 sm:size-10 sm:shadow-none"
        >
          ×
        </button>

        {/* Left: Product Image / Video Gallery (supports touch swipe on mobile) */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative overflow-hidden rounded-[16px] bg-ink/5 shadow-sm sm:rounded-[18px]"
          >
            {activeMedia.type === 'video' ? (
              <video
                key={activeMedia.src}
                src={activeMedia.src}
                controls
                playsInline
                loop
                className="aspect-[4/4.2] max-h-[44dvh] w-full object-cover sm:aspect-[236/267] sm:max-h-none"
              />
            ) : (
              <img
                key={activeMedia.src}
                src={activeMedia.src}
                alt={`Handmade crochet ${product.name.toLowerCase()} — view ${safeMediaIndex + 1}`}
                className="aspect-[4/4.2] max-h-[44dvh] w-full object-cover sm:aspect-[236/267] sm:max-h-none"
              />
            )}

            {/* Carousel controls when multiple photos/videos exist */}
            {hasMultipleMedia && (
              <>
                <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-0.5 text-xs font-semibold text-cream backdrop-blur-xs">
                  {safeMediaIndex + 1} / {mediaList.length}
                </span>

                <button
                  type="button"
                  onClick={prevMedia}
                  aria-label="Previous photo or video"
                  className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-xl leading-none text-ink shadow-md transition-transform hover:scale-105 hover:bg-cream active:scale-95 sm:left-2.5"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextMedia}
                  aria-label="Next photo or video"
                  className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-cream/90 text-xl leading-none text-ink shadow-md transition-transform hover:scale-105 hover:bg-cream active:scale-95 sm:right-2.5"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultipleMedia && (
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-0.5 py-1">
              {mediaList.map((item, idx) => {
                const isSelected = idx === safeMediaIndex;
                return (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => setMediaIndex(idx)}
                    aria-label={`Show ${item.type} ${idx + 1} of ${mediaList.length}`}
                    aria-current={isSelected ? 'true' : undefined}
                    className={`relative size-12 shrink-0 cursor-pointer overflow-hidden rounded-[10px] transition-all sm:size-14 ${
                      isSelected
                        ? 'ring-2 ring-cherry ring-offset-2 ring-offset-cream'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="relative flex h-full w-full items-center justify-center bg-ink text-cream">
                        <video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover opacity-65" />
                        <span className="absolute flex size-6 items-center justify-center rounded-full bg-cherry text-[11px] text-white shadow">
                          ▶
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="sm:pr-2">
          <p className="font-script text-[22px] font-semibold leading-none text-leaf sm:text-[26px]">
            {product.category}
          </p>
          <h3
            id="product-modal-title"
            className="mt-1 font-display text-[28px] font-bold leading-[1.1] text-ink sm:mt-1.5 sm:text-[40px]"
          >
            {product.name}
          </h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink/90 sm:mt-3.5 sm:text-[16px]">
            Made to order by hand. Colours, size and details can be changed to suit you.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
            <a
              href={site.dmUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-primary flex-1 text-center sm:flex-none"
            >
              Ask about this piece
            </a>
            <button
              type="button"
              onClick={() => onTogglePick(product.id)}
              className={`flex-1 cursor-pointer rounded-full border-2 border-ink px-4 py-2.5 text-center text-[14.5px] font-bold transition-all active:scale-95 sm:flex-none sm:px-5 sm:text-[15px] ${
                isPicked
                  ? 'bg-blush/70 text-ink hover:bg-blush'
                  : 'bg-transparent text-ink hover:bg-blush/60'
              }`}
            >
              {isPicked ? 'In my picks' : 'Add to my picks'}
            </button>
          </div>

          {/* Product-to-product pagination */}
          {total > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-[15px] font-medium text-ink/85 sm:mt-6 sm:justify-start">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous piece"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink/70 text-lg leading-none transition-colors hover:bg-blush active:scale-95"
              >
                ‹
              </button>
              <span className="min-w-[54px] text-center">
                {index + 1} of {total}
              </span>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next piece"
                className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink/70 text-lg leading-none transition-colors hover:bg-blush active:scale-95"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
