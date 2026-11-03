import type { CSSProperties, ReactNode } from 'react'

// Decorative screens of « Comment se déroule une mission » (designs/13-page-prestations/
// process-ecran.html): one shopping journey (Céramia, a ceramics shop) followed from research to
// final design. Fixed illustration content, hidden from screen readers. Animations: globals.css.

const delay = (...seconds: number[]): CSSProperties => ({
  animationDelay: seconds.map((s) => `${s}s`).join(', '),
})
const bar = 'rounded-[4px]'
const vase = 'M30 6h20v12c0 4 16 14 16 40 0 26-10 44-26 44S14 84 14 58c0-26 16-36 16-40z'
const product = 'Vase Céramique'

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

function Understand() {
  const sticky =
    'absolute w-37.5 animate-drop p-3.5 text-sm font-semibold shadow-[0_10px_20px_rgb(0_0_0/0.08)]'
  return (
    <div className="absolute inset-7 grid animate-appear grid-cols-2 items-center gap-6">
      <div className="flex animate-pop flex-col gap-3 rounded-[1.125rem] border border-[#e3e4ec] bg-card p-5 shadow-[0_12px_28px_rgb(40_36_90/0.08)]">
        <div className="flex items-center gap-3">
          <span className="size-12 shrink-0 rounded-full bg-peach" />
          <div className="flex flex-col gap-1">
            <strong className="text-sm">Claire, 34 ans</strong>
            <span className="text-xs text-decor-muted">Achète déco en ligne, surtout sur mobile</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[0.6875rem] font-bold">
          <span className="rounded-md bg-secondary px-2 py-1 text-primary-strong">2 commandes / mois</span>
          <span className="rounded-md bg-tag-warm px-2 py-1 text-tag-warm-foreground">Panier moyen 60 €</span>
        </div>
        <div className="rounded-xl bg-[#f4f3ff] p-3 text-[0.8125rem] text-primary-strong italic">
          « J’abandonne quand je ne sais pas quand je serai livrée. »
        </div>
      </div>
      <div className="relative h-67.5">
        <span className={`${sticky} top-[4%] left-[4%] bg-[#ffe7a0] [rotate:-5deg]`} style={delay(0.15)}>
          Trouver le bon produit vite
        </span>
        <span className={`${sticky} top-[30%] right-0 bg-accent [rotate:4deg]`} style={delay(0.35)}>
          Voir le prix et la livraison
        </span>
        <span className={`${sticky} bottom-[2%] left-[12%] bg-peach [rotate:-2deg]`} style={delay(0.55)}>
          Payer sans créer de compte
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
      <div className="flex h-7.5 items-center gap-2 rounded-md bg-[#d9d9df] px-2.5">
        <span className="h-2 w-15 rounded bg-[#b9b9c2]" />
        <span className="ml-auto size-4 rounded bg-[#c7c7cf]" />
      </div>
      <div className="grid flex-1 grid-cols-4 content-start gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="flex flex-col gap-1.25">
            <div className="h-15 bg-[#ebebef]" />
            <div className="h-1.5 w-[80%] bg-[#e3e3e8]" />
            <div className="h-1.5 w-[40%] bg-[#e3e3e8]" />
          </div>
        ))}
      </div>
      <span className={`${pin} top-[1%] right-[2%]`} style={delay(0.1, 0.7)}>
        1
      </span>
      <span className={`${pin} top-[22%] left-[14%]`} style={delay(0.3, 0.9)}>
        2
      </span>
      <span className={`${pin} top-[36%] left-[58%]`} style={delay(0.5, 1.1)}>
        3
      </span>
      <div
        className="absolute right-0 bottom-0 flex animate-appear flex-col gap-0.5 rounded-[0.625rem] bg-foreground px-3.5 py-3 text-xs leading-[1.6] text-white"
        style={delay(0.8)}
      >
        <strong>Liste produits — 3 freins repérés</strong>
        <span>
          <span className="text-[#f6a58a]">1</span> Panier peu visible
        </span>
        <span>
          <span className="text-[#f6a58a]">2</span> Aucun filtre ni tri
        </span>
        <span>
          <span className="text-[#f6a58a]">3</span> Photos petites, prix illisibles
        </span>
      </div>
    </div>
  )
}

function Structure() {
  const frame =
    'ps-frame flex flex-1 flex-col gap-2 rounded-[0.875rem] border-2 border-dashed border-[#b9b4f5] p-3'
  const link = 'h-0.5 w-7.5 origin-left animate-trace self-center bg-primary'
  const line = `bg-[#e3e4ec] ${bar}`
  const notes = [
    'Filtres et tri en haut de liste',
    'Prix + délai de livraison sur la fiche',
    'Panier latéral, sans changer de page',
  ]
  return (
    <div className="absolute inset-7 flex animate-appear flex-col justify-center gap-5.5">
      <div className="relative flex items-stretch gap-2.5">
        {/* Each frame lights up when the cursor reaches it. */}
        <div className={frame} style={delay(0.05, 1.1)}>
          <strong className="text-xs">Liste produits</strong>
          <div className="flex gap-1">
            <span className="h-3 w-8.5 rounded-full border-[1.5px] border-[#cfccf7]" />
            <span className="h-3 w-6.5 rounded-full border-[1.5px] border-[#cfccf7]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-11.5 rounded-md bg-muted" />
            <div className="h-11.5 rounded-md bg-muted outline-2 outline-offset-1 outline-primary" />
            <div className="h-11.5 rounded-md bg-muted" />
            <div className="h-11.5 rounded-md bg-muted" />
          </div>
        </div>
        <span className={link} style={delay(0.35)} />
        <div className={frame} style={delay(0.45, 2.3)}>
          <strong className="text-xs">Fiche produit</strong>
          <div className="h-17.5 rounded-md bg-muted" />
          <div className={`h-1.75 w-[70%] ${line}`} />
          <div className={`h-1.75 w-[40%] ${line}`} />
          <div className="h-5 rounded-full border-2 border-primary" />
        </div>
        <span className={link} style={delay(0.75)} />
        <div className={frame} style={delay(0.85, 3.6)}>
          <strong className="text-xs">Panier</strong>
          <div className="flex items-center gap-1.5">
            <div className="size-7.5 rounded-md bg-muted" />
            <div className="flex flex-1 flex-col gap-1">
              <div className={`h-1.5 w-[80%] ${line}`} />
              <div className={`h-1.5 w-[40%] ${line}`} />
            </div>
          </div>
          <div className="h-px bg-[#e3e4ec]" />
          <div className="flex justify-between">
            <span className={`h-1.75 w-[40%] ${line}`} />
            <span className={`h-1.75 w-[20%] ${line}`} />
          </div>
          <div className="h-5 rounded-full bg-accent" />
        </div>
        <Cursor className="ps-cursor-3 z-[4]" />
      </div>
      <div className="flex animate-appear flex-wrap gap-2" style={delay(1)}>
        {notes.map((note) => (
          <span
            key={note}
            className="rounded-lg bg-[#f4f3ff] px-2.5 py-1.5 text-[0.6875rem] font-bold text-primary-strong"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  )
}

function Design() {
  const swatch = 'size-5.5 animate-pop rounded-[7px]'
  const label = 'text-[0.625rem] text-decor-muted'
  const price = 'text-[0.6875rem] font-bold text-primary'
  const card = 'overflow-hidden rounded-xl border border-[#e3e4ec]'
  const tile = 'flex h-37.5 items-center justify-center'
  return (
    <div className="absolute inset-5.5 grid animate-appear grid-cols-[minmax(0,170px)_minmax(0,1fr)] gap-4.5">
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
            className="animate-pop self-start rounded-full bg-primary px-3 py-1.5 text-[0.625rem] font-bold text-white"
            style={delay(0.5)}
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
            className="flex animate-pop flex-col gap-[3px] rounded-lg border border-[#e3e4ec] bg-card p-1.25"
            style={delay(0.66)}
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

        <div className="relative h-87.5 overflow-hidden">
          {/* 1. Product list: the cursor hovers the second card, then opens it. */}
          <div className="ps-list absolute inset-0 flex flex-col gap-3">
            <div className="flex h-7 items-center gap-2 text-[0.625rem] font-bold">
              <strong className="text-[0.8125rem]">Vases &amp; céramiques</strong>
              <span className="ml-auto rounded-full bg-secondary px-2 py-1 text-primary-strong">Couleur</span>
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
                <div className={`${tile} relative bg-[radial-gradient(70%_60%_at_30%_20%,#dad8fa,#f3eef1)]`}>
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
            <div className="relative flex items-center justify-center rounded-[0.875rem] bg-[radial-gradient(70%_60%_at_25%_15%,#dad8fa,rgb(218_216_250/0)_70%),radial-gradient(70%_60%_at_85%_85%,#fce1d3,rgb(252_225_211/0)_70%),#f3eef1]">
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
              <strong className="font-heading text-[0.9375rem] leading-tight font-semibold">{product}</strong>
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
  )
}

export const processScenes = [Understand, Analyse, Structure, Design]
// How long each step stays on screen while the animation plays by itself (ms).
export const processDurations = [3800, 3800, 4600, 8500]
