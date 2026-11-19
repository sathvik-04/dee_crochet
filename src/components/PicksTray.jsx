import { useState } from 'react';
import { site } from '../data/site';

export default function PicksTray({ pickedProducts, onRemove, onClear }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (pickedProducts.length === 0) return null;

  const message = [
    `Hi! I'd love to order from ${site.handle}:`,
    ...pickedProducts.map((p) => `- ${p.name}`),
  ].join('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-HTTPS contexts
      const textarea = document.createElement('textarea');
      textarea.value = message;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(460px,calc(100vw-28px))] -translate-x-1/2">
      <div className="overflow-hidden rounded-[20px] bg-ink text-cream shadow-[0_18px_45px_rgba(59,36,24,0.38)]">
        {/* Header Bar */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left text-[15px] font-bold transition-colors hover:bg-white/5"
        >
          <span>My picks ({pickedProducts.length})</span>
          <span className="font-medium text-cream/90">{open ? 'Hide' : 'Show'}</span>
        </button>

        {/* Expanded Panel */}
        {open && (
          <div className="border-t border-cream/12 px-5 pb-5 pt-2">
            {/* List of picked items */}
            <ul className="max-h-44 divide-y divide-cream/12 overflow-y-auto pr-1 text-[15px]">
              {pickedProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <span className="font-medium text-cream">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    aria-label={`Remove ${p.name} from picks`}
                    className="ml-3 flex size-7 cursor-pointer items-center justify-center rounded-full text-base leading-none text-cream/75 transition-colors hover:bg-white/10 hover:text-cream"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[13.5px] text-cream/80">
              Copy this message, then paste it into our Instagram DM.
            </p>

            <textarea
              readOnly
              value={message}
              rows={Math.min(6, Math.max(4, pickedProducts.length + 1))}
              onFocus={(e) => e.target.select()}
              aria-label="Pre-filled Instagram order message"
              className="mt-2.5 w-full resize-none rounded-[14px] bg-cream p-3.5 text-[14.5px] leading-snug text-ink focus:outline-none"
            />

            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-[14.5px] font-bold text-cherry transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {copied ? 'Copied!' : 'Copy message'}
              </button>
              <a
                href={site.dmUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-5 py-2.5 text-[14.5px] font-bold text-cherry transition-transform hover:scale-[1.02]"
              >
                Open Instagram
              </a>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="ml-auto cursor-pointer text-[14px] text-cream/75 underline underline-offset-4 transition-colors hover:text-cream"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
