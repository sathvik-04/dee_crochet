export default function CrochetDivider({ topColor = '#FBF3E4', bottomColor = '#F3E3CF', stitchColor = '#3B2418', flip = false }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden leading-none select-none"
      style={{ backgroundColor: topColor }}
    >
      <svg
        viewBox="0 0 1200 36"
        preserveAspectRatio="none"
        className={`block h-[22px] w-full sm:h-[28px] ${flip ? 'scale-y-[-1]' : ''}`}
      >
        {/* Scalloped crochet lace edge */}
        <path
          d="M0,36 L0,20 Q30,2 60,20 T120,20 T180,20 T240,20 T300,20 T360,20 T420,20 T480,20 T540,20 T600,20 T660,20 T720,20 T780,20 T840,20 T900,20 T960,20 T1020,20 T1080,20 T1140,20 T1200,20 L1200,36 Z"
          fill={bottomColor}
        />
        {/* Delicate hand-stitched dashed crochet line along the scallop */}
        <path
          d="M0,20 Q30,2 60,20 T120,20 T180,20 T240,20 T300,20 T360,20 T420,20 T480,20 T540,20 T600,20 T660,20 T720,20 T780,20 T840,20 T900,20 T960,20 T1020,20 T1080,20 T1140,20 T1200,20"
          fill="none"
          stroke={stitchColor}
          strokeWidth="1.75"
          strokeDasharray="6 6"
          strokeLinecap="round"
          opacity="0.28"
        />
      </svg>
    </div>
  );
}
