import type { CSSProperties, ReactNode } from 'react'

// Decorative screens of « Comment se déroule une mission » (designs/70-animation-process/
// Process-B-Ecran.dc.html): one shopping journey (Céramia, a ceramics shop) followed from research
// to final design; each step ends on the deliverable it produces. Fixed illustration content,
// hidden from screen readers. Animations: globals.css (ps-*).

const delay = (...seconds: number[]): CSSProperties => ({
  animationDelay: seconds.map((s) => `${s}s`).join(', '),
})
const vase = 'M30 6h20v12c0 4 16 14 16 40 0 26-10 44-26 44S14 84 14 58c0-26 16-36 16-40z'
const product = 'Vase Céramique'
const icon = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Vase({ fill, width = '34%', path = vase }: { fill: string; width?: string; path?: string }) {
  return (
    <svg viewBox="0 0 80 110" style={{ width }} fill="none" aria-hidden="true">
      <path d={path} fill={fill} />
    </svg>
  )
}

function Cursor({ className, children }: { className: string; children?: ReactNode }) {
  return (
    <span className={`pointer-events-none absolute top-0 left-0 ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        width="22"
        height="26"
        viewBox="0 0 26 30"
        className="block drop-shadow-[0_3px_6px_rgb(0_0_0/0.25)]"
      >
        <path
          d="M2 2l20 10-9 2.5L9 26z"
          fill="#121814"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

// The deliverable of a step: an indigo-outlined card that rises once the step has played.
function Outcome({
  at,
  label,
  title,
  children,
  icon: glyph,
}: {
  at: number
  label: string
  title: string
  children?: ReactNode
  icon: ReactNode
}) {
  return (
    <div
      className="ps-reveal flex items-center gap-3 rounded-[0.875rem] border-[1.5px] border-primary bg-card px-3.5 py-3 shadow-[0_0_0_5px_rgb(79_70_229/0.1),0_14px_28px_rgb(40_36_90/0.1)]"
      style={delay(at)}
    >
      <span className="flex size-8.5 shrink-0 items-center justify-center rounded-[0.625rem] bg-primary text-white">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" {...icon}>
          {glyph}
        </svg>
      </span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-[0.625rem] font-bold tracking-[0.08em] text-primary uppercase">{label}</span>
        <strong className="text-[0.8125rem] leading-[1.35]">{title}</strong>
      </span>
      {children}
    </div>
  )
}

const kicker = 'text-[0.5625rem] font-bold tracking-[0.08em] uppercase'

function Sticky({
  tilt,
  at,
  tone,
  kind,
  children,
}: {
  tilt: number
  at: number
  tone: 'cool' | 'warm'
  kind: string
  children: ReactNode
}) {
  return (
    <div
      className={`ps-postit relative flex flex-col gap-1.25 rounded-[4px_4px_10px_4px] px-3 pt-3.5 pb-3 ${tone === 'cool' ? 'bg-secondary' : 'bg-peach'}`}
      style={{ ...delay(at), '--r': `${tilt}deg` } as CSSProperties}
    >
      <span className="absolute -top-1.75 left-1/2 -ml-4.75 h-3.25 w-9.5 -rotate-4 rounded-[2px] border border-[rgb(18_24_20/0.05)] bg-white/70" />
      <span className={`${kicker} ${tone === 'cool' ? 'text-primary-strong' : 'text-[#8a3b1e]'}`}>
        {kind}
      </span>
      <span className="text-[0.8125rem] leading-[1.3] font-semibold">{children}</span>
    </div>
  )
}

function Understand() {
  return (
    <div className="absolute inset-0 grid animate-appear grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-5.5 bg-[radial-gradient(#e3e2ec_1.2px,transparent_1.2px)] bg-size-[18px_18px] p-6.5">
      <div className="flex flex-col gap-3.5">
        <div className="flex animate-pop flex-col gap-3 rounded-[1.125rem] border border-[#e3e4ec] bg-card p-4.5 shadow-[0_12px_28px_rgb(40_36_90/0.08)]">
          <div className="flex items-center gap-3">
            <span className="relative size-13 shrink-0">
              <span className="absolute inset-1 flex items-end justify-center overflow-hidden rounded-full bg-[#e2e1ff]">
                <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="#4F46E5">
                  <circle cx="20" cy="15" r="7.5" />
                  <path d="M5 40c1.5-9 7.5-14 15-14s13.5 5 15 14z" />
                </svg>
              </span>
              <svg aria-hidden="true" viewBox="0 0 52 52" fill="none" className="ps-ring absolute inset-0">
                <circle
                  cx="26"
                  cy="26"
                  r="24.5"
                  pathLength="100"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  transform="rotate(-90 26 26)"
                />
              </svg>
            </span>
            <span className="flex flex-col gap-0.75">
              <strong className="text-[0.9375rem]">Claire, 34 ans</strong>
              <span className="text-xs text-decor-muted">Achète déco en ligne, surtout sur mobile</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[0.6875rem] font-bold">
            <span className="rounded-md bg-secondary px-2 py-1 text-primary-strong">2 commandes / mois</span>
            <span className="rounded-md bg-tag-warm px-2 py-1 text-tag-warm-foreground">
              Panier moyen 60 €
            </span>
          </div>
        </div>
        <div className="ps-bubble relative ml-5.5 max-w-[92%] self-start rounded-[0.875rem] bg-foreground px-3.5 py-2.75 text-[0.8125rem] leading-[1.45] text-white italic">
          <span className="absolute top-[-6px] left-4.5 size-3 rotate-45 rounded-[2px] bg-foreground" />«
          J’abandonne quand je ne sais pas quand je serai livrée. »
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 items-start gap-x-3 gap-y-3.5">
          <Sticky tilt={-2} at={0.9} tone="cool" kind="Attente">
            Trouver vite le bon produit
          </Sticky>
          <div className="relative">
            <Sticky tilt={2} at={1.15} tone="warm" kind="Frein">
              Délai de livraison flou
            </Sticky>
            {/* The key finding gets circled by hand. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              fill="none"
              className="ps-circle pointer-events-none absolute -inset-x-2.5 -inset-y-2.25 h-[calc(100%+18px)] w-[calc(100%+20px)] overflow-visible"
            >
              <path
                d="M50 3 C80 2 97 14 97 30 C97 48 76 58 48 57 C20 56 3 46 3 29 C3 13 24 3 54 5"
                pathLength="100"
                stroke="#4F46E5"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Sticky tilt={1.5} at={1.4} tone="cool" kind="Attente">
            Voir le prix tout de suite
          </Sticky>
          <Sticky tilt={-1.5} at={1.65} tone="warm" kind="Frein">
            Compte obligatoire pour payer
          </Sticky>
        </div>
        <Outcome
          at={2.9}
          label="Insight"
          title="Afficher la date de livraison dès la liste produits"
          icon={
            <>
              <path d="M9 18h6M10 21h4" />
              <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
            </>
          }
        />
      </div>
    </div>
  )
}

// Audit findings: pin on the page (left %, top px), label on the right (top px), severity.
const findings = [
  { left: 52, top: 3, label: -4, title: 'Bouton panier peu visible', level: 'Critique' },
  { left: 46, top: 37, label: 56, title: 'Aucun filtre ni tri', level: 'Majeur' },
  { left: 16, top: 139, label: 130, title: 'Photos minuscules, prix illisibles', level: 'Critique' },
]
const pinDelays = [0.3, 0.55, 0.95]
const severity = (level: string) =>
  level === 'Critique' ? 'bg-[#fde7e0] text-[#b4401c]' : 'bg-peach text-[#8a3b1e]'

function Analyse() {
  const ghost = 'rounded-[2px]'
  return (
    <div className="absolute inset-0 flex animate-appear flex-col gap-4 px-5.5 pt-5.5 pb-4.5">
      <div className="relative h-75">
        {/* The current product list, greyed out, scanned top to bottom. */}
        <div className="absolute top-0 left-0 flex h-full w-[56%] flex-col gap-2.5 overflow-hidden rounded-[0.625rem] border border-[#e3e4ec] bg-[#fbfbfc] pb-2.5">
          <div className="flex h-7 items-center gap-2 bg-[#e9e9ee] px-2.5">
            <span className="h-1.75 w-11.5 rounded-[3px] bg-[#c9c9d1]" />
            <span className="h-1 w-5.5 rounded-[2px] bg-[#d6d6dd]" />
            <span className="h-1 w-5.5 rounded-[2px] bg-[#d6d6dd]" />
            <span className="ml-auto size-2.25 rounded-[2px] bg-[#d0d0d7]" />
          </div>
          <div className="flex h-5.5 items-center gap-2 px-2.5">
            <span className="h-1.75 w-17.5 rounded-[3px] bg-[#cfcfd6]" />
            <span className="ml-auto h-3.5 w-15 rounded border border-dashed border-[#d3d3da]" />
          </div>
          <div className="grid grid-cols-4 gap-x-1.5 gap-y-2 px-2.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="flex flex-col gap-[3px]">
                <span className={`h-8.5 bg-[#e6e6eb] ${ghost}`} />
                <span className={`h-1 w-[80%] bg-[#dadae0] ${ghost}`} />
                <span className={`h-[3px] w-[35%] bg-[#e2e2e7] ${ghost}`} />
              </div>
            ))}
          </div>
          <div className="mx-2.5 mt-0.5 h-1.5 w-[40%] rounded-[3px] bg-[#e2e2e7]" />
        </div>
        <div className="pointer-events-none absolute top-0 left-0 h-full w-[56%] overflow-hidden rounded-[0.625rem]">
          <span className="ps-scan" />
        </div>
        <span className="ps-heat absolute top-29.5 left-[calc(16%-40px)] h-16 w-20" />
        {findings.map((finding, index) => (
          <span
            key={finding.title}
            className="absolute z-[3] flex size-5.5 animate-pin items-center justify-center rounded-full bg-[#e0603a] text-[0.6875rem] font-bold text-white"
            style={{
              left: `calc(${finding.left}% - 11px)`,
              top: finding.top,
              ...delay(pinDelays[index], pinDelays[index] + 0.6),
            }}
          >
            {index + 1}
          </span>
        ))}
        {findings.map((finding, index) => (
          <span
            key={finding.title}
            className="ps-lead absolute z-[2] h-[1.5px] bg-[#e0603a]"
            style={{
              left: `${finding.left}%`,
              width: `${60 - finding.left}%`,
              top: finding.top + 11,
              ...delay(1.4 + index * 0.3),
            }}
          />
        ))}
        {findings.map((finding, index) => (
          <div
            key={finding.title}
            className="ps-tag absolute right-0 left-[60%] z-[2]"
            style={{ top: finding.label, ...delay(1.6 + index * 0.3) }}
          >
            <div className="flex items-start gap-2 rounded-[0.625rem] border border-[#e3e4ec] bg-card px-2.5 py-2 shadow-[0_6px_14px_rgb(40_36_90/0.07)]">
              <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#e0603a] text-[0.625rem] font-bold text-white">
                {index + 1}
              </span>
              <span className="flex flex-col gap-1">
                <strong className="text-xs leading-[1.3]">{finding.title}</strong>
                <span className="flex flex-wrap gap-1 text-[0.5625rem] font-bold">
                  <span
                    className={`self-start rounded px-1.5 py-0.5 tracking-[0.06em] uppercase ${severity(finding.level)}`}
                  >
                    {finding.level}
                  </span>
                  {index === 2 ? (
                    <span className="ps-heat-figure rounded bg-foreground px-1.5 py-0.5 text-white">
                      38 % de clics perdus
                    </span>
                  ) : null}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Outcome
        at={3.2}
        label="Rapport d’audit"
        title="3 freins majeurs · 12 recommandations priorisées"
        icon={
          <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 13h6M9 17h4" />
          </>
        }
      >
        <span className="flex items-center gap-2">
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F1F5" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#E0603A"
              strokeWidth="4"
              strokeDasharray="47.5 88"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
            <text
              x="18"
              y="21.5"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#121814"
              className="font-heading"
            >
              54
            </text>
          </svg>
          <span className="flex flex-col">
            <span className="text-[0.625rem] text-decor-muted">Score UX</span>
            <strong className="text-[0.6875rem]">/ 100</strong>
          </span>
        </span>
      </Outcome>
    </div>
  )
}

function Structure() {
  const node =
    'animate-pop rounded-[7px] border-[1.5px] border-[#dcdaf8] bg-card px-2.25 py-1.25 text-[0.6875rem] font-bold whitespace-nowrap'
  const lineH = 'ps-line-h inline-block h-[1.5px] bg-[#b9b4f5]'
  const caption = 'text-[0.625rem] font-bold tracking-[0.06em] text-decor-muted uppercase'
  const frame =
    'relative box-border flex h-37.5 flex-col gap-1.5 rounded-[0.625rem] border-[1.5px] border-dashed border-[#b9b4f5] bg-card p-2'
  const line = 'block h-1 rounded-[2px] bg-[#e3e4ec]'
  const pill = 'inline-block h-2.5 w-7.5 rounded-full border-[1.5px] border-primary'
  const check = (label: string, at: number) => (
    <span className="absolute top-1.5 right-1.5">
      <span
        className="ps-check inline-block rounded bg-[#dff5e7] px-1.25 py-0.5 text-[0.5rem] font-bold text-[#1d6b3e]"
        style={delay(at)}
      >
        ✓ {label}
      </span>
    </span>
  )
  const delivery = 'text-[0.5rem] font-bold text-[#8a3b1e]'
  return (
    <div className="absolute inset-0 flex animate-appear flex-col gap-3.5 px-5.5 pt-5 pb-4.5">
      {/* Site map, drawn branch by branch. */}
      <div className="flex items-center gap-3.5">
        <span className={`w-18.5 ${caption}`}>Arbo&shy;rescence</span>
        <div className="relative flex flex-1 items-center">
          <span className={node} style={delay(0.05)}>
            Accueil
          </span>
          <span className={`${lineH} w-8.5`} style={delay(0.3)} />
          <div className="relative flex flex-col gap-1.5 pl-3.5">
            <span
              className="ps-line-v absolute top-3.25 bottom-3.25 left-0 w-[1.5px] bg-[#b9b4f5]"
              style={delay(0.45)}
            />
            <div className="flex items-center">
              <span className={`${lineH} -ml-3.5 w-3.5`} style={delay(0.55)} />
              <span className={`${node} border-primary bg-primary text-white`} style={delay(0.6)}>
                Vases
              </span>
              <span className={`${lineH} w-6`} style={delay(0.8)} />
              <span className={node} style={delay(0.85)}>
                Fiche
              </span>
              <span className={`${lineH} w-6`} style={delay(1)} />
              <span className={node} style={delay(1.05)}>
                Panier
              </span>
            </div>
            <div className="flex items-center">
              <span className={`${lineH} -ml-3.5 w-3.5`} style={delay(0.6)} />
              <span className={node} style={delay(0.7)}>
                Tables
              </span>
            </div>
            <div className="flex items-center">
              <span className={`${lineH} -ml-3.5 w-3.5`} style={delay(0.65)} />
              <span className={node} style={delay(0.8)}>
                Luminaires
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wireframes of the journey, then prototype links between them. */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-[9%]">
          <div className="flex animate-pop flex-col gap-1.5" style={delay(1.15)}>
            <span className={caption}>Liste produits</span>
            <div className={frame}>
              <div className="flex items-center gap-1">
                <span className={pill} />
                <span className={pill} />
                <span className={`${pill} w-5.5`} />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="ps-hot-1 flex flex-col gap-[3px] rounded-md p-[3px]">
                  <span className="ps-img" />
                  <span className={`${line} w-[80%]`} />
                  <span className={`self-start rounded-[3px] bg-peach px-1 py-px ${delivery}`}>
                    Livré jeudi
                  </span>
                </div>
                <div className="flex flex-col gap-[3px] p-[3px]">
                  <span className="ps-img" />
                  <span className={`${line} w-[70%]`} />
                  <span className={`${line} w-[40%] opacity-60`} />
                </div>
              </div>
              {check('Filtres', 2)}
            </div>
          </div>
          <div className="flex animate-pop flex-col gap-1.5" style={delay(1.4)}>
            <span className={caption}>Fiche produit</span>
            <div className={frame}>
              <span className="ps-img h-11.5" />
              <span className={`${line} h-1.5 w-[75%]`} />
              <span className={`${line} w-[40%]`} />
              <span className={delivery}>● Livré jeudi</span>
              <span className="ps-hot-2 h-4 rounded-full bg-primary" />
              {check('CTA visible', 2.25)}
            </div>
          </div>
          <div className="flex animate-pop flex-col gap-1.5" style={delay(1.65)}>
            <span className={caption}>Panier latéral</span>
            <div className={frame}>
              <div className="flex items-center gap-1.25">
                <span className="ps-img size-6 shrink-0" />
                <div className="flex flex-1 flex-col gap-[3px]">
                  <span className={`${line} w-[85%]`} />
                  <span className={`${line} w-[45%]`} />
                </div>
              </div>
              <span className="h-px bg-[#e3e4ec]" />
              <div className="flex justify-between">
                <span className={`${line} w-[30%]`} />
                <span className={`${line} w-[20%]`} />
              </div>
              <span className="mt-auto h-4 rounded-full bg-foreground" />
              {check('Sans compte', 2.5)}
            </div>
          </div>
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          className="ps-noodle ps-noodle-1"
        >
          <path
            d="M13 42 C 24 42, 26 30, 36.3 30"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          className="ps-noodle ps-noodle-2"
        >
          <path
            d="M61 75 C 69 75, 65 30, 72.7 30"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="ps-dot top-[calc(42%-4px)] left-[calc(13%-4px)]" style={delay(2.8)} />
        <span className="ps-dot ps-dot-end top-[calc(30%-4px)] left-[calc(36.3%-4px)]" style={delay(3.25)} />
        <span className="ps-dot top-[calc(75%-4px)] left-[calc(61%-4px)]" style={delay(3.2)} />
        <span className="ps-dot ps-dot-end top-[calc(30%-4px)] left-[calc(72.7%-4px)]" style={delay(3.65)} />
      </div>

      <Outcome
        at={3.9}
        label="Prototype cliquable"
        title="Parcours d’achat en 3 écrans, testé avec 5 utilisateurs"
        icon={
          <>
            <rect x="3" y="4" width="7" height="7" rx="1.5" />
            <rect x="14" y="13" width="7" height="7" rx="1.5" />
            <path d="M10 7.5h3a2 2 0 0 1 2 2V13" />
          </>
        }
      >
        <span className="rounded-full bg-[#dff5e7] px-2.25 py-1 text-[0.6875rem] font-bold whitespace-nowrap text-[#1d6b3e]">
          5 / 5 réussites
        </span>
      </Outcome>
    </div>
  )
}

function Design() {
  const swatch = 'size-5.5 animate-pop rounded-[7px]'
  const label = 'text-[0.625rem] text-decor-muted'
  const price = 'text-[0.6875rem] font-bold text-primary'
  const card = 'overflow-hidden rounded-xl border border-[#e3e4ec]'
  const tile = 'flex h-29.5 items-center justify-center'
  return (
    <div className="absolute inset-5.5 flex animate-appear flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-4.5">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#ececf2] bg-background p-3.5">
          <span className="text-[0.625rem] font-bold tracking-[0.08em] text-primary uppercase">
            Design system
          </span>
          <div className="flex flex-col gap-1.5">
            <span className={label}>Couleurs</span>
            <div className="flex gap-1.25">
              <span className={`${swatch} bg-primary`} style={delay(0.05)} />
              <span className={`${swatch} bg-[#dad8fa]`} style={delay(0.12)} />
              <span className={`${swatch} bg-peach`} style={delay(0.19)} />
              <span className={`${swatch} bg-foreground`} style={delay(0.26)} />
              <span className={`${swatch} border border-border bg-card`} style={delay(0.33)} />
            </div>
          </div>
          <div className="flex animate-pop flex-col gap-1" style={delay(0.4)}>
            <span className={label}>Typographie</span>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-xl font-semibold">Aa</span>
              <span className="text-xl font-medium">Aa</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={label}>Composants</span>
            <span
              className="ps-flash self-start rounded-full bg-primary px-3 py-1.5 text-[0.625rem] font-bold text-white"
              style={delay(0.5, 3.2)}
            >
              Bouton
            </span>
            <div className="flex animate-pop gap-1.25" style={delay(0.58)}>
              <span className="rounded bg-secondary px-1.5 py-0.75 text-[0.5625rem] font-bold text-primary-strong">
                Tag
              </span>
              <span className="rounded bg-tag-warm px-1.5 py-0.75 text-[0.5625rem] font-bold text-tag-warm-foreground">
                Badge
              </span>
            </div>
            <div
              className="ps-flash flex flex-col gap-[3px] rounded-lg border border-[#e3e4ec] bg-card p-1.25"
              style={delay(0.66, 1)}
            >
              <span className="h-6.5 rounded-[5px] bg-[linear-gradient(135deg,#dad8fa,#fce1d3)]" />
              <span className="h-1 w-[70%] rounded-[2px] bg-foreground" />
              <span className="h-1 w-[35%] rounded-[2px] bg-primary" />
            </div>
            <span className="text-[0.5625rem] text-[#8a8a98]">Carte produit</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          <div
            className="flex h-9 shrink-0 animate-pop items-center gap-3 rounded-[0.625rem] border border-[#ececf2] px-3 text-[0.625rem] text-decor-muted"
            style={delay(0.7)}
          >
            <strong className="font-heading text-xs text-primary">Céramia</strong>
            <span>Vases</span>
            <span>Tables</span>
            <span>Luminaires</span>
            <span className="relative ml-auto flex size-5.5 items-center justify-center">
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#121814"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <path d="M4 6.5h12l-1 10.5H5z" />
                <path d="M7.5 8.5V5.5a2.5 2.5 0 0 1 5 0v3" />
              </svg>
              <span className="ps-badge absolute -top-1.5 -right-1.5 flex h-3.75 min-w-3.75 items-center justify-center rounded-full bg-primary text-[0.5625rem] font-bold text-white">
                1
              </span>
            </span>
          </div>

          <div className="relative h-72.5 overflow-hidden">
            {/* 1. Product list: the cursor hovers the second card, then opens it. */}
            <div className="ps-list absolute inset-0 flex flex-col gap-3">
              <div className="flex h-7 items-center gap-2 text-[0.625rem] font-bold">
                <strong className="text-[0.8125rem]">Vases &amp; céramiques</strong>
                <span className="ml-auto rounded-full bg-secondary px-2 py-1 text-primary-strong">
                  Couleur
                </span>
                <span className="rounded-full border border-[#e3e4ec] px-2 py-0.75">Prix</span>
                <span className="rounded-full border border-[#e3e4ec] px-2 py-0.75">Trier</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className={`${card} animate-pop`} style={delay(0.85)}>
                  <div className={`${tile} bg-[radial-gradient(70%_60%_at_30%_20%,#fce1d3,#f3eef1)]`}>
                    <Vase fill="#E0855E" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-2">
                    <span className="text-[0.6875rem] font-bold">Vase Terre</span>
                    <span className={price}>39,00 €</span>
                  </div>
                </div>
                <div className={`${card} ps-hover`}>
                  <div
                    className={`${tile} relative bg-[radial-gradient(70%_60%_at_30%_20%,#dad8fa,#f3eef1)]`}
                  >
                    <span className="absolute top-2 left-2 rounded bg-tag-warm px-1.5 py-0.5 text-[0.5625rem] font-bold text-tag-warm-foreground">
                      Nouveau
                    </span>
                    <Vase fill="#4F46E5" />
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-2">
                    <span className="text-[0.6875rem] font-bold">{product}</span>
                    <span className={price}>49,00 €</span>
                  </div>
                </div>
                <div className={`${card} animate-pop`} style={delay(1.05)}>
                  <div className={`${tile} bg-[radial-gradient(70%_60%_at_30%_20%,#e1eaf7,#f3eef1)]`}>
                    <Vase
                      fill="#121814"
                      width="40%"
                      path="M24 20h32c6 0 10 10 10 34 0 30-10 48-26 48S14 84 14 54c0-24 4-34 10-34z"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-2">
                    <span className="text-[0.6875rem] font-bold">Pot Basalte</span>
                    <span className={price}>29,00 €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product page: the cursor adds the vase to the cart. */}
            <div className="ps-sheet absolute inset-0 grid grid-cols-2 gap-4">
              <div className="relative flex items-center justify-center rounded-[0.875rem] bg-[#f3eef1] bg-[image:radial-gradient(70%_60%_at_25%_15%,#dad8fa,rgb(218_216_250/0)_70%),radial-gradient(70%_60%_at_85%_85%,#fce1d3,rgb(252_225_211/0)_70%)]">
                <svg viewBox="0 0 80 110" className="w-[40%]" fill="none" aria-hidden="true">
                  <ellipse cx="40" cy="104" rx="26" ry="4" fill="#121814" opacity=".08" />
                  <path d={vase} fill="#4F46E5" />
                  <path
                    d="M22 50c8 6 28 6 36 0"
                    stroke="#DAD8FA"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity=".7"
                  />
                </svg>
                <span className="absolute top-2.5 left-2.5 rounded bg-tag-warm px-1.75 py-0.75 text-[0.5625rem] font-bold text-tag-warm-foreground">
                  Nouveau
                </span>
                <div className="absolute inset-x-2.5 bottom-2.5 flex gap-1.5">
                  <span className="h-7 flex-1 rounded-[7px] border-2 border-primary bg-white/75" />
                  <span className="h-7 flex-1 rounded-[7px] bg-white/55" />
                  <span className="h-7 flex-1 rounded-[7px] bg-white/55" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[0.625rem] text-[#8a8a98]">Vases › {product}</span>
                <strong className="font-heading text-[0.9375rem] leading-tight font-semibold">
                  {product}
                </strong>
                <span className="text-[0.6875rem] text-decor-muted">
                  <span className="tracking-[1px] text-primary">★★★★★</span> 128 avis
                </span>
                <strong className="text-[1.1875rem] font-bold">49,00 €</strong>
                <div className="flex flex-col gap-1.25">
                  <span className="text-[0.625rem] text-decor-muted">Couleur : Indigo</span>
                  <div className="flex gap-1.5">
                    <span className="size-4 rounded-full bg-primary shadow-[0_0_0_2px_#fff,0_0_0_3.5px_#4f46e5]" />
                    <span className="size-4 rounded-full bg-[#e0855e]" />
                    <span className="size-4 rounded-full bg-foreground" />
                  </div>
                </div>
                <span className="text-[0.625rem] font-semibold text-success-foreground">
                  ● En stock · livré jeudi
                </span>
                <span className="ps-add mt-auto flex h-9.5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  Ajouter au panier
                </span>
              </div>
            </div>

            {/* 3. Side cart slides in, without leaving the page. */}
            <span className="ps-veil absolute inset-0 rounded-xl bg-[rgb(18_24_20/0.18)]" />
            <div className="ps-drawer absolute inset-y-0 right-0 flex w-[48%] flex-col gap-3 rounded-[0.875rem] bg-card p-3.5 shadow-[-18px_0_40px_rgb(40_36_90/0.18)]">
              <div className="flex items-center justify-between">
                <strong className="text-[0.8125rem]">Panier (1)</strong>
                <span className="text-sm text-decor-muted">×</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-11 items-center justify-center rounded-lg bg-[radial-gradient(70%_60%_at_30%_20%,#dad8fa,#f3eef1)]">
                  <Vase fill="#4F46E5" width="40%" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[0.6875rem] font-bold">{product}</span>
                  <span className="text-[0.625rem] text-decor-muted">Indigo · Qté 1</span>
                </span>
                <strong className="ml-auto text-[0.6875rem]">49,00 €</strong>
              </div>
              <div className="h-px bg-[#ececf2]" />
              <div className="flex justify-between text-[0.6875rem]">
                <span className="text-decor-muted">Livraison</span>
                <span className="font-bold text-success-foreground">Offerte</span>
              </div>
              <div className="flex justify-between text-[0.8125rem] font-bold">
                <span>Total</span>
                <span>49,00 €</span>
              </div>
              <span className="mt-auto flex h-9.5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                Commander
              </span>
              <span className="pb-1.5 text-center text-[0.625rem] font-bold text-primary">
                Continuer mes achats
              </span>
            </div>

            <Cursor className="ps-cursor-4 z-[6]">
              <span className="ps-ripple ps-ripple-1" />
              <span className="ps-ripple ps-ripple-2" />
            </Cursor>
          </div>
        </div>
      </div>
      <Outcome
        at={6.6}
        label="Maquettes prêtes à développer"
        title="Design system, écrans responsive et specs pour les devs"
        icon={<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />}
      >
        <span className="flex gap-1.25 text-[0.625rem] font-bold whitespace-nowrap">
          <span className="rounded-full bg-[#f4f3ff] px-2 py-1 text-primary-strong">Desktop</span>
          <span className="rounded-full bg-[#f4f3ff] px-2 py-1 text-primary-strong">Mobile</span>
          <span className="rounded-full bg-[#dff5e7] px-2 py-1 text-[#1d6b3e]">Handoff ✓</span>
        </span>
      </Outcome>
    </div>
  )
}

export const processScenes = [Understand, Analyse, Structure, Design]
// How long each step stays on screen while the animation plays by itself (ms).
export const processDurations = [5200, 5200, 5600, 9200]
