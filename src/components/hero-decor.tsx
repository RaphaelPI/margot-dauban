// Fixed decorative cards around the homepage title (mockup V4 · 8). Purely visual:
// hidden from assistive tech and on screens too narrow to keep them clear of the text.
const card =
  'absolute hidden flex-col rounded-2xl border border-decor-border bg-card shadow-[0_20px_40px_rgb(40_36_90/0.12)] xl:flex'

const swatches = [
  { name: 'Indigo / 500', hex: '#4F46E5' },
  { name: 'Indigo / 700', hex: '#3730A3' },
  { name: 'Pêche / 100', hex: '#FCE1D3' },
]

export function HeroDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className={`${card} top-10 -left-26 w-49 -rotate-5 gap-2 p-3 text-[11px]`}>
        <div className="flex items-center justify-between">
          <strong className="text-xs">Couleurs</strong>
          <span className="text-[10px] text-decor-muted">5 styles</span>
        </div>
        <div className="flex h-6.5 overflow-hidden rounded-[7px]">
          <span className="flex-1 bg-primary-strong" />
          <span className="flex-1 bg-primary" />
          <span className="flex-1 bg-lilac" />
          <span className="flex-1 bg-accent" />
          <span className="flex-1 bg-peach" />
        </div>
        <div className="flex flex-col gap-1.25">
          {swatches.map((swatch) => (
            <div key={swatch.hex} className="flex items-center gap-1.75">
              <span
                className="size-3.5 rounded border border-black/5"
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="flex-1">{swatch.name}</span>
              <span className="text-decor-muted">{swatch.hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${card} top-88 -left-34 w-62.5 rotate-3 gap-3.5 px-4 pt-3.5 pb-4 text-xs`}>
        <div className="flex items-center justify-between">
          <strong className="text-[13px]">Stepper</strong>
          <span className="text-[11px] text-decor-muted">Composant</span>
        </div>
        <div className="flex items-start">
          <Step label="Panier" className="w-14">
            <span className="flex size-6.5 items-center justify-center rounded-full bg-primary">
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </span>
          </Step>
          <span className="mt-3 h-0.5 flex-1 bg-primary" />
          <Step label="Livraison" className="w-16 font-bold text-primary-strong">
            <span className="flex size-6.5 items-center justify-center rounded-full border-2 border-primary bg-card font-bold text-primary-strong ring-4 ring-accent">
              2
            </span>
          </Step>
          <span className="mt-3 h-0.5 flex-1 bg-decor-border" />
          <Step label="Paiement" className="w-15 text-decor-muted">
            <span className="flex size-6.5 items-center justify-center rounded-full bg-muted font-bold">
              3
            </span>
          </Step>
        </div>
      </div>

      <div className={`${card} top-28 -right-31 w-57.5 rotate-5 gap-2 p-4 text-xs`}>
        <span className="text-decor-muted">Taux de conversion</span>
        <div className="flex items-baseline gap-2">
          <strong className="font-heading text-[1.625rem] font-semibold">4,8 %</strong>
          <span className="rounded-full bg-success/15 px-1.75 py-0.75 font-bold text-success-foreground">
            ▲ 1,2 pt
          </span>
        </div>
        <svg aria-hidden="true" width="198" height="54" viewBox="0 0 198 54" fill="none">
          <path
            d="M2 46 L30 40 L58 43 L86 30 L114 33 L142 20 L170 22 L196 8 L196 54 L2 54 Z"
            className="fill-accent"
            opacity="0.6"
          />
          <path
            d="M2 46 L30 40 L58 43 L86 30 L114 33 L142 20 L170 22 L196 8"
            className="stroke-primary"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[11px] text-decor-muted">30 derniers jours</span>
      </div>

      <div className="absolute top-110 right-[24%] hidden xl:block">
        <div className="flex animate-float flex-col items-start gap-0.5 motion-reduce:animate-none">
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="fill-primary"
            stroke="#fff"
            strokeWidth="1.5"
          >
            <path d="M4 3l16 7-7 2-2 7z" />
          </svg>
          <span className="ml-4 rounded-full bg-primary px-2.5 py-1.25 text-[13px] font-bold text-primary-foreground">
            Margot
          </span>
        </div>
      </div>
    </div>
  )
}

function Step({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className ?? ''}`}>
      {children}
      <span>{label}</span>
    </div>
  )
}
