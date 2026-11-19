export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="mb-9 flex flex-wrap justify-center gap-2.5" role="group" aria-label="Filter by category">
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={c === active}
          onClick={() => onChange(c)}
          className={`min-h-11 cursor-pointer rounded-full border-2 border-ink px-5 font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${c === active
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
