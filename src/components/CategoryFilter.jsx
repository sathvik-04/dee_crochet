export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div
      className="no-scrollbar -mx-2 mb-6 flex flex-nowrap items-center justify-start gap-2 overflow-x-auto px-2 pb-1.5 sm:mx-0 sm:mb-9 sm:flex-wrap sm:justify-center sm:gap-2.5 sm:overflow-visible sm:px-0 sm:pb-0"
      role="group"
      aria-label="Filter by category"
    >
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={c === active}
          onClick={() => onChange(c)}
          className={`min-h-10 shrink-0 cursor-pointer whitespace-nowrap rounded-full border-2 border-ink px-4 text-[14.5px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 sm:min-h-11 sm:px-5 sm:text-[16px] ${
            c === active
              ? 'bg-ink text-cream shadow-[0_6px_14px_rgba(59,36,24,0.18)]'
              : 'bg-transparent text-ink hover:bg-blush'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
