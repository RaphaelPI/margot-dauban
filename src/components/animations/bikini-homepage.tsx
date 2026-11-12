'use client'

import { Pause, Play } from '@phosphor-icons/react'
import { cn } from 'cn'
import { useCallback, useEffect, useRef, useState } from 'react'

// « Une page d'accueil modulable » (Le Bikini, #74): real homepage blocks, cut from two captures
// of the redesigned grid. One block changes content, then the grid rearranges, in a loop.
// Images live in /public: they are part of this animation, not content managed in the admin.

const src = (name: string) => `/animations/bikini-accueil/${name}.webp`

// Page space of the captures (px): a 3 × 3 grid under a fixed header.
const W = 1510
const H = 1749
const GX = 42
const GY = 284
const CW = 1426 / 3
const RH = 475
const pct = (value: number, total: number) => `${(value / total) * 100}%`

type Variant = 'A' | 'B'
// [column, row, columns spanned, rows spanned, variant shown]. null = hidden (keeps its place).
type Slot = readonly [number, number, number, number, Variant?]
type BlockName =
  | 'affiche'
  | 'maxcooper'
  | 'camille'
  | 'spotify'
  | 'plan'
  | 'objets'
  | 'horaires'
  | 'une'
  | 'curio'
type State = 'A' | 'A2' | 'B'

const STATES: Record<State, Record<BlockName, Slot | null>> = {
  A: {
    curio: [0, 0, 2, 1, 'A'],
    une: [2, 0, 1, 1, 'A'],
    affiche: [0, 1, 1, 2],
    objets: [1, 1, 1, 1],
    plan: [2, 1, 1, 1],
    spotify: [1, 2, 1, 1],
    horaires: [2, 2, 1, 1, 'A'],
    maxcooper: null,
    camille: null,
  },
  A2: {
    curio: [0, 0, 2, 1, 'A'],
    une: [2, 0, 1, 1, 'B'],
    affiche: [0, 1, 1, 2],
    objets: [1, 1, 1, 1],
    plan: [2, 1, 1, 1],
    spotify: [1, 2, 1, 1],
    horaires: [2, 2, 1, 1, 'A'],
    maxcooper: null,
    camille: null,
  },
  B: {
    curio: [0, 1, 1, 2, 'B'],
    une: [2, 0, 1, 1, 'B'],
    affiche: null,
    objets: [1, 0, 1, 1],
    plan: [1, 1, 1, 1],
    spotify: [1, 2, 1, 1],
    horaires: [2, 1, 1, 1, 'B'],
    maxcooper: [0, 0, 1, 1],
    camille: [2, 2, 1, 1],
  },
}
const HIDDEN_AT: Partial<Record<BlockName, Slot>> = {
  affiche: [0, 1, 1, 2],
  maxcooper: [0, 0, 1, 1],
  camille: [2, 2, 1, 1],
}
// Staggered delays (s) so blocks don't run into each other.
const DELAYS: Record<string, Partial<Record<BlockName, number>>> = {
  'A2>B': { affiche: 0, curio: 0.18, objets: 0.1, plan: 0.2, horaires: 0.3, maxcooper: 0.6, camille: 0.7 },
  'B>A2': { maxcooper: 0, camille: 0, horaires: 0.14, plan: 0.24, objets: 0.34, curio: 0.2, affiche: 0.7 },
}

type Caption = 'contenu' | 'grille'
const SEQUENCE: { state: State; caption: Caption | null; duration: number; flash?: BlockName }[] = [
  // The first step is short: the animation starts almost as soon as it's on screen.
  { state: 'A', caption: null, duration: 500 },
  { state: 'A2', caption: 'contenu', duration: 1700, flash: 'une' },
  { state: 'B', caption: 'grille', duration: 2500 },
  { state: 'A2', caption: 'grille', duration: 1800 },
  { state: 'A', caption: 'contenu', duration: 1300, flash: 'une' },
]

const BLOCKS: { name: BlockName; images: { variant?: Variant; file: string }[] }[] = [
  { name: 'affiche', images: [{ file: 'curio-affiche' }] },
  { name: 'maxcooper', images: [{ file: 'max-cooper' }] },
  { name: 'camille', images: [{ file: 'camille' }] },
  { name: 'spotify', images: [{ file: 'spotify' }] },
  { name: 'plan', images: [{ file: 'plan' }] },
  { name: 'objets', images: [{ file: 'objets-trouves' }] },
  {
    name: 'horaires',
    images: [
      { variant: 'A', file: 'horaires-clair' },
      { variant: 'B', file: 'horaires-sombre' },
    ],
  },
  {
    name: 'une',
    images: [
      { variant: 'A', file: 'afterwork' },
      { variant: 'B', file: 'dirty' },
    ],
  },
  {
    name: 'curio',
    images: [
      { variant: 'A', file: 'curio-texte-noir' },
      { variant: 'B', file: 'curio-texte-clair' },
    ],
  },
]

const CAPTIONS: { id: Caption; num: number; label: string }[] = [
  { id: 'contenu', num: 1, label: 'Le contenu d’un bloc change' },
  { id: 'grille', num: 2, label: 'Les blocs se réorganisent' },
]

export function BikiniHomepageAnimation({ className }: { className?: string }) {
  const scene = useRef<HTMLDivElement>(null)
  const blocks = useRef<Partial<Record<BlockName, HTMLDivElement | null>>>({})
  const [caption, setCaption] = useState<Caption | null>(null)
  const [playing, setPlaying] = useState(false)
  const current = useRef<State>('A')
  const step = useRef(0)
  const timers = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  // Moves every block to its place in `state`, animated unless `instant`.
  const place = useCallback(
    (state: State, instant: boolean) => {
      const key = `${current.current}>${state}`
      for (const { name } of BLOCKS) {
        const el = blocks.current[name]
        if (!el) continue
        const target = STATES[state][name]
        const slot = target ?? HIDDEN_AT[name]
        if (!slot) continue
        const delay = instant ? 0 : (DELAYS[key]?.[name] ?? 0)
        const [col, row, cols, rows, variant] = slot
        el.style.transitionDelay = `${delay}s`
        el.style.left = pct(GX + col * CW, W)
        el.style.top = pct(GY + row * RH, H)
        el.style.width = pct(cols * CW, W)
        el.style.height = pct(rows * RH, H)
        el.style.zIndex = String(target ? (cols * rows > 1 ? 3 : 2) : 1)
        el.dataset.hidden = String(!target)
        if (!variant) continue

        const images = el.querySelectorAll<HTMLImageElement>('img[data-variant]')
        const size = `${cols}x${rows}`
        const changed = el.dataset.variant !== variant || el.dataset.size !== size
        const show = () => {
          for (const img of images) {
            img.style.transition = 'opacity .35s ease'
            img.style.transitionDelay = '0s'
            img.style.opacity = img.dataset.variant === variant ? '1' : '0'
          }
        }
        el.dataset.variant = variant
        el.dataset.size = size
        if (instant || !changed) show()
        else if (name === 'une') {
          // Same place, new content: the new poster fades in over the old one.
          for (const img of images) {
            img.style.transition = 'opacity .5s ease'
            img.style.transitionDelay = `${delay}s`
            img.style.opacity = img.dataset.variant === 'A' || variant === 'B' ? '1' : '0'
          }
        } else {
          // The block empties, moves and resizes, then shows its new version.
          for (const img of images) {
            img.style.transition = 'opacity .25s ease'
            img.style.transitionDelay = `${delay}s`
            img.style.opacity = '0'
          }
          later(show, (delay + 0.7) * 1000)
        }
      }
      current.current = state
    },
    [later],
  )

  // Stops the loop; a block caught mid-move still shows its current version.
  const stop = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
    for (const el of Object.values(blocks.current)) {
      if (!el?.dataset.variant) continue
      for (const img of el.querySelectorAll<HTMLImageElement>('img[data-variant]')) {
        img.style.opacity = img.dataset.variant === el.dataset.variant ? '1' : '0'
      }
    }
  }, [])

  const run = useCallback(
    function next() {
      const { state, caption: label, duration, flash } = SEQUENCE[step.current]
      place(state, false)
      setCaption(label)
      const flashed = flash ? blocks.current[flash] : null
      if (flashed) {
        flashed.dataset.flash = 'true'
        later(() => {
          flashed.dataset.flash = 'false'
        }, 1000)
      }
      step.current = (step.current + 1) % SEQUENCE.length
      later(next, duration)
    },
    [place, later],
  )

  // Initial layout, then autoplay once the animation is on screen (never with reduced motion).
  useEffect(() => {
    place('A', true)
    const el = scene.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlaying(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [place])

  useEffect(() => {
    if (!playing) return
    run()
    return stop
  }, [playing, run, stop])

  return (
    // Inside a step's rich text: its spacing, list and image styles must not reach the animation.
    <figure className={cn('flex flex-col gap-4 [&_*]:mt-0!', className)}>
      <ul
        aria-label="Ce que montre l’animation"
        className="flex list-none! flex-wrap justify-center gap-2.5 pl-0!"
      >
        {CAPTIONS.map(({ id, num, label }) => (
          <li
            key={id}
            className={cn(
              'flex items-center gap-2.5 rounded-xl bg-ink py-1.5 pr-4 pl-1.5 text-sm font-semibold text-ink-foreground transition-opacity duration-400 motion-reduce:transition-none',
              caption === id ? 'opacity-100' : 'opacity-35',
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-full bg-bikini text-xs font-bold text-white"
            >
              {num}
            </span>
            {label}
          </li>
        ))}
      </ul>

      <div
        ref={scene}
        className="relative aspect-[1510/1749] w-full overflow-hidden rounded-[1.125rem] border bg-muted"
      >
        <div
          role="img"
          aria-label="Page d’accueil du Bikini : un bloc change de contenu, puis les blocs de la grille changent de place et de taille."
          className="absolute inset-0"
        >
          {/* biome-ignore lint/performance/noImgElement: fixed decorative frames of an animation, not CMS media */}
          <img
            src={src('haut-de-page')}
            alt=""
            width={1510}
            height={284}
            className="absolute top-0 left-0 h-auto w-full rounded-none!"
          />
          <div
            className="absolute bg-card"
            style={{ left: pct(GX, W), top: pct(GY, H), width: pct(CW * 3, W), height: pct(RH * 3, H) }}
          />
          {BLOCKS.map(({ name, images }) => (
            <div
              key={name}
              ref={(el) => {
                blocks.current[name] = el
              }}
              data-hidden="false"
              className={cn(
                'absolute overflow-hidden bg-muted transition-[left,top,width,height,opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none',
                'data-[hidden=true]:scale-94 data-[hidden=true]:opacity-0 data-[flash=true]:shadow-[inset_0_0_0_6px_var(--bikini)]',
              )}
            >
              {images.map(({ variant, file }) => (
                // biome-ignore lint/performance/noImgElement: fixed decorative frames of an animation, not CMS media
                <img
                  key={file}
                  src={src(file)}
                  alt=""
                  data-variant={variant}
                  className="absolute inset-0 size-full! rounded-none! object-cover object-top"
                />
              ))}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setPlaying((on) => !on)}
          className="absolute right-3 bottom-3 z-20 flex items-center gap-1.5 rounded-full border bg-card/90 px-3 py-2 text-xs font-semibold text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {playing ? <Pause weight="fill" aria-hidden="true" /> : <Play weight="fill" aria-hidden="true" />}
          {playing ? 'Pause' : 'Lecture'}
        </button>
      </div>
    </figure>
  )
}
