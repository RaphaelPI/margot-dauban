import type { CSSProperties } from 'react'

// Decorative screens of « Comment se déroule une mission » (designs/13-page-prestations/
// process-ecran.html), one per step. Fixed illustration content: hidden from screen readers.

const delay = (...seconds: number[]): CSSProperties => ({
  animationDelay: seconds.map((s) => `${s}s`).join(', '),
})
const bar = 'rounded-[4px]'

function Understand() {
  return (
    <div className="absolute inset-7 grid animate-appear grid-cols-2 items-center gap-6">
      <div className="flex animate-pop flex-col gap-3 rounded-[1.125rem] border border-[#e3e4ec] bg-card p-5 shadow-[0_12px_28px_rgb(40_36_90/0.08)]">
        <div className="flex items-center gap-3">
          <span className="size-12 rounded-full bg-peach" />
          <div className="flex flex-col gap-1.5">
            <strong className="text-sm">Persona</strong>
            <span className="text-xs text-decor-muted">Utilisatrice principale</span>
          </div>
        </div>
        <div className={`h-2 w-[90%] bg-decor-border ${bar}`} />
        <div className={`h-2 w-[70%] bg-decor-border ${bar}`} />
        <div className="rounded-xl bg-[#f4f3ff] p-3 text-[0.8125rem] text-primary-strong italic">
          « Je ne sais jamais où cliquer. »
        </div>
      </div>
      <div className="relative h-65">
        <span
          className="absolute top-[6%] left-[4%] w-37.5 animate-drop bg-[#ffe7a0] p-3.5 text-sm font-semibold shadow-[0_10px_20px_rgb(0_0_0/0.08)] [rotate:-5deg]"
          style={delay(0.15)}
        >
          Gagner du temps
        </span>
        <span
          className="absolute top-[30%] right-[2%] w-37.5 animate-drop bg-accent p-3.5 text-sm font-semibold shadow-[0_10px_20px_rgb(0_0_0/0.08)] [rotate:4deg]"
          style={delay(0.35)}
        >
          Trouver l’info vite
        </span>
        <span
          className="absolute bottom-[4%] left-[14%] w-37.5 animate-drop bg-peach p-3.5 text-sm font-semibold shadow-[0_10px_20px_rgb(0_0_0/0.08)] [rotate:-2deg]"
          style={delay(0.55)}
        >
          Être rassuré
        </span>
      </div>
    </div>
  )
}

function Analyse() {
  const pin =
    'absolute flex size-7 animate-pin items-center justify-center rounded-full bg-[#e0603a] text-[0.8125rem] font-bold text-white'
  return (
    <div className="absolute inset-7 flex animate-appear flex-col gap-3">
      <div className="h-7.5 rounded-md bg-[#d9d9df]" />
      <div className="grid flex-1 grid-cols-[180px_1fr] gap-3">
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-3.5 rounded-[3px] bg-[#e3e3e8]" />
          ))}
        </div>
        <div className="relative grid grid-cols-3 content-start gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-17.5 bg-[#ebebef]" />
          ))}
          <span className="pointer-events-none absolute top-[40%] left-[30%] h-30 w-45 rounded-full bg-[radial-gradient(closest-side,rgb(224_96_58/0.35),rgb(224_96_58/0))]" />
        </div>
      </div>
      <span className={`${pin} top-[4%] left-[8%]`} style={delay(0.1, 0.7)}>
        1
      </span>
      <span className={`${pin} top-[42%] left-[22%]`} style={delay(0.3, 0.9)}>
        2
      </span>
      <span className={`${pin} top-[55%] right-[18%]`} style={delay(0.5, 1.1)}>
        3
      </span>
      <span
        className="absolute right-0 bottom-0 animate-appear rounded-lg bg-foreground px-3 py-2 text-xs text-white"
        style={delay(0.7)}
      >
        3 points de friction repérés
      </span>
    </div>
  )
}

function Structure() {
  const page =
    'flex flex-1 animate-pop flex-col gap-2 rounded-[0.875rem] border-2 border-dashed border-[#b9b4f5] p-3.5'
  const link = 'h-0.5 w-9 origin-left animate-trace bg-primary'
  return (
    <div className="absolute inset-7 flex animate-appear flex-col justify-center gap-7">
      <div className="flex items-center gap-2.5">
        <div className={page} style={delay(0.05)}>
          <strong className="text-[0.8125rem]">Accueil</strong>
          <div className="h-10 rounded-md bg-muted" />
          <div className={`h-2 w-[70%] bg-[#e3e4ec] ${bar}`} />
        </div>
        <span className={link} style={delay(0.3)} />
        <div className={page} style={delay(0.4)}>
          <strong className="text-[0.8125rem]">Catalogue</strong>
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className={`h-4.5 bg-muted ${bar}`} />
            ))}
          </div>
        </div>
        <span className={link} style={delay(0.65)} />
        <div className={page} style={delay(0.75)}>
          <strong className="text-[0.8125rem]">Fiche</strong>
          <div className="h-10 rounded-md bg-muted" />
          <div className="h-4.5 w-1/2 rounded-full bg-accent" />
        </div>
      </div>
      <div className="grid animate-appear grid-cols-[140px_1fr] gap-3" style={delay(0.9)}>
        <div className="h-30 rounded-[0.625rem] border-2 border-[#e3e4ec]" />
        <div className="flex flex-col gap-2.5">
          <div className={`h-4 w-[60%] bg-[#e3e4ec] ${bar}`} />
          <div className={`h-2.5 bg-decor-border ${bar}`} />
          <div className={`h-2.5 w-[80%] bg-decor-border ${bar}`} />
          <div className="h-7.5 w-30 rounded-lg border-2 border-[#cfccf7]" />
        </div>
      </div>
    </div>
  )
}

function Design() {
  const swatch = 'size-6 animate-pop rounded-[7px]'
  const label = 'text-[0.625rem] text-decor-muted'
  return (
    <div className="absolute inset-5.5 grid animate-appear grid-cols-[minmax(0,190px)_minmax(0,1fr)] gap-4.5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#ececf2] bg-background p-3.5">
        <span className="text-[0.625rem] font-bold tracking-[0.08em] text-primary uppercase">
          Design system
        </span>
        <div className="flex flex-col gap-1.5">
          <span className={label}>Couleurs</span>
          <div className="flex gap-1.5">
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
            <span className="font-heading text-[1.375rem] font-semibold">Aa</span>
            <span className="text-[1.375rem] font-medium">Aa</span>
          </div>
          <div className="flex flex-col gap-[3px]">
            <span className="h-1.5 w-[80%] rounded-[3px] bg-foreground" />
            <span className="h-1 w-[60%] rounded-[3px] bg-[#b7b7c4]" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={label}>Composants</span>
          <span
            className="animate-pop self-start rounded-full bg-primary px-3 py-1.5 text-[0.625rem] font-bold text-white"
            style={delay(0.55)}
          >
            Bouton
          </span>
          <span
            className="animate-pop self-start rounded-full border border-[#cfccf7] px-3 py-1.5 text-[0.625rem] font-bold text-primary-strong"
            style={delay(0.62)}
          >
            Secondaire
          </span>
          <div className="flex animate-pop gap-1.5" style={delay(0.7)}>
            <span className="rounded bg-secondary px-1.5 py-0.75 text-[0.5625rem] font-bold text-primary-strong">
              Tag
            </span>
            <span className="rounded bg-tag-warm px-1.5 py-0.75 text-[0.5625rem] font-bold text-tag-warm-foreground">
              Badge
            </span>
          </div>
          <div
            className="flex h-6 animate-pop items-center rounded-lg border border-[#dcdce5] bg-card px-2"
            style={delay(0.78)}
          >
            <span className="h-1 w-1/2 rounded-[3px] bg-[#d5d5de]" />
          </div>
        </div>
      </div>
      <div className="relative grid grid-cols-2 items-start gap-4.5">
        <div
          className="relative flex aspect-[4/5] animate-pop items-center justify-center rounded-2xl bg-[radial-gradient(70%_60%_at_25%_15%,#dad8fa,rgb(218_216_250/0)_70%),radial-gradient(70%_60%_at_85%_85%,#fce1d3,rgb(252_225_211/0)_70%),#f3eef1]"
          style={delay(0.95)}
        >
          <svg viewBox="0 0 80 110" className="h-auto w-[46%]" fill="none" aria-hidden="true">
            <ellipse cx="40" cy="104" rx="26" ry="4" fill="#121814" opacity=".08" />
            <path
              d="M30 6h20v12c0 4 16 14 16 40 0 26-10 44-26 44S14 84 14 58c0-26 16-36 16-40z"
              fill="#4F46E5"
            />
            <path d="M30 6h20" stroke="#312E81" strokeWidth="4" strokeLinecap="round" />
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
            <span className="h-7.5 flex-1 rounded-[7px] border-2 border-primary bg-white/75" />
            <span className="h-7.5 flex-1 rounded-[7px] bg-white/55" />
            <span className="h-7.5 flex-1 rounded-[7px] bg-white/55" />
          </div>
        </div>
        <div className="flex flex-col gap-2.25">
          <span className="animate-appear text-[0.625rem] text-[#8a8a98]" style={delay(1.1)}>
            Maison › Déco › Vases
          </span>
          <strong
            className="animate-appear font-heading text-base leading-tight font-semibold"
            style={delay(1.2)}
          >
            Vase Céramique
          </strong>
          <span className="animate-appear text-[0.6875rem] text-decor-muted" style={delay(1.3)}>
            <span className="tracking-[1px] text-primary">★★★★★</span> 128 avis
          </span>
          <strong className="animate-appear text-xl font-bold" style={delay(1.4)}>
            49,00 €
          </strong>
          <div className="flex animate-appear flex-col gap-1.25" style={delay(1.55)}>
            <span className="text-[0.625rem] text-decor-muted">Couleur : Indigo</span>
            <div className="flex gap-1.5">
              <span className="size-4.5 rounded-full bg-primary shadow-[0_0_0_2px_#fff,0_0_0_3.5px_#4f46e5]" />
              <span className="size-4.5 rounded-full bg-peach" />
              <span className="size-4.5 rounded-full bg-foreground" />
            </div>
          </div>
          <div className="flex animate-appear gap-1.5 text-[0.625rem]" style={delay(1.7)}>
            <span className="rounded-lg border border-[#dcdce5] px-2.5 py-1.25">S</span>
            <span className="rounded-lg border-[1.5px] border-primary px-2.5 py-1.25 font-bold text-primary-strong">
              M
            </span>
            <span className="rounded-lg border border-[#dcdce5] px-2.5 py-1.25">L</span>
          </div>
          <span
            className="mt-1 animate-press rounded-full bg-primary px-3.5 py-2.5 text-center text-xs font-bold text-white"
            style={delay(1.9, 3.1)}
          >
            Ajouter au panier
          </span>
          <span className="animate-appear text-[0.625rem] text-decor-muted" style={delay(2.05)}>
            ✓ Livraison offerte dès 60 €
          </span>
        </div>
        <span className="absolute right-0 bottom-0 animate-toast rounded-lg bg-foreground px-3 py-2 text-[0.6875rem] text-white">
          ✓ Ajouté au panier
        </span>
      </div>
    </div>
  )
}

export const processScenes = [Understand, Analyse, Structure, Design]
// How long each step stays on screen while the animation plays by itself (ms).
export const processDurations = [3600, 3600, 3600, 6000]
