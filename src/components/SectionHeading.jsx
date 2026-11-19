export default function SectionHeading({ script, title, className = '' }) {
  return (
    <div className={className}>
      <p className="font-script text-[30px] font-semibold text-cherry">{script}</p>
      <h2 className="font-display text-[length:clamp(34px,4.5vw,52px)] font-bold leading-[1.1]">{title}</h2>
    </div>
  );
}
