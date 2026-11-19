import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product, index, isPicked, onTogglePick, onOpen }) {
  return (
    <article
      data-cursor="view"
      onClick={() => onOpen(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(index);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name}`}
      className="group relative cursor-pointer rounded-[22px] bg-white p-2.5 pb-[18px] shadow-[0_8px_24px_rgba(59,36,24,0.08)] transition-transform duration-300 hover:-translate-y-1.5 hover:-rotate-1"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '260px 360px' }}
    >
      <div className="relative overflow-hidden rounded-[14px]">
        <img
          src={product.image}
          alt={`Handmade crochet ${product.name.toLowerCase()}`}
          loading="lazy"
          decoding="async"
          className="aspect-[236/267] w-full rounded-[14px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Top-right heart pick button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePick(product.id);
          }}
          aria-pressed={isPicked}
          aria-label={isPicked ? `Remove ${product.name} from my picks` : `Add ${product.name} to my picks`}
          className="absolute right-2.5 top-2.5 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-cherry shadow-[0_4px_12px_rgba(59,36,24,0.18)] transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[19px]"
            fill={isPicked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.5s-7.5-4.6-9.5-9.1C1.1 8.2 3.1 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.7 0 5.7 3.7 4.3 6.9-2 4.5-9.5 9.1-9.5 9.1Z" />
          </svg>
        </button>
      </div>

      <h3 className="mx-2 mt-3.5 font-display text-xl font-semibold">{product.name}</h3>
      <p className="mx-2 font-script text-[22px] font-semibold text-leaf">{product.category}</p>
    </article>
  );
});

export default ProductCard;
