import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product, index, isPicked, onTogglePick, onOpen }) {
  return (
    <article
      className="group relative rounded-[18px] bg-white p-2 pb-3 shadow-[0_8px_24px_rgba(59,36,24,0.08)] transition-transform duration-300 active:scale-[0.98] sm:rounded-[22px] sm:p-2.5 sm:pb-[18px] sm:hover:-translate-y-1.5 sm:hover:-rotate-1"
    >
      {/* Semantic button trigger for viewing the product (avoids invalid role="button" on <article>) */}
      <button
        type="button"
        data-cursor="view"
        onClick={() => onOpen(index)}
        aria-label={`View ${product.name}`}
        className="block w-full cursor-pointer text-left focus-visible:rounded-[14px]"
      >
        <div className="overflow-hidden rounded-[12px] sm:rounded-[14px]">
          <img
            src={product.image}
            alt={`Handmade crochet ${product.name.toLowerCase()}`}
            width={472}
            height={534}
            loading="lazy"
            decoding="async"
            className="aspect-[236/267] w-full rounded-[12px] object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:rounded-[14px]"
          />
        </div>

        <h3 className="mx-1.5 mt-2.5 font-display text-[15.5px] font-semibold leading-snug sm:mx-2 sm:mt-3.5 sm:text-xl">
          {product.name}
        </h3>
        <p className="mx-1.5 font-script text-[18px] font-semibold leading-tight text-leaf sm:mx-2 sm:text-[22px]">
          {product.category}
        </p>
      </button>

      {/* Top-right heart pick button */}
      <button
        type="button"
        onClick={() => onTogglePick(product.id)}
        aria-pressed={isPicked}
        aria-label={isPicked ? `Remove ${product.name} from my picks` : `Add ${product.name} to my picks`}
        className="absolute right-4 top-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/95 text-cherry shadow-[0_4px_12px_rgba(59,36,24,0.18)] transition-transform duration-200 hover:scale-110 active:scale-95 sm:right-5 sm:top-5 sm:size-9"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[17px] sm:size-[19px]"
          fill={isPicked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20.5s-7.5-4.6-9.5-9.1C1.1 8.2 3.1 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.7 0 5.7 3.7 4.3 6.9-2 4.5-9.5 9.1-9.5 9.1Z" />
        </svg>
      </button>
    </article>
  );
});

export default ProductCard;
