'use client'

import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { processDurations, processScenes } from './process-scenes'

const [sceneWidth, sceneHeight] = [620, 440]

type Step = { id?: string | null; title: string; text?: string | null; screenLabel?: string | null }

// « Comment se déroule une mission »: steps as tabs, a screen that builds itself for the
// selected step. Plays by itself; stops for good once the visitor picks a step, pauses while
// hovered or focused, never plays with reduced motion.
export function ProcessShowcase({ steps }: { steps: Step[] }) {
  const shown = steps.slice(0, processScenes.length)
  const [current, setCurrent] = useState(0)
  const [auto, setAuto] = useState(false)
  const [paused, setPaused] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  // The screen fills the panel; below 620px wide it is drawn at 620 and scaled down (phones).
  const screen = useRef<HTMLDivElement>(null)
  const [panelWidth, setPanelWidth] = useState(sceneWidth)
  const scale = Math.min(1, panelWidth / sceneWidth)
  useEffect(() => {
    const el = screen.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setPanelWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setAuto(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (!auto || paused || shown.length < 2) return
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % shown.length), processDurations[current])
    return () => clearTimeout(timer)
  }, [auto, paused, current, shown.length])

  const pick = (index: number, focus = false) => {
    setAuto(false)
    setCurrent(index)
    if (focus) tabs.current[index]?.focus()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    const last = shown.length - 1
    const next = {
      ArrowDown: current + 1,
      ArrowRight: current + 1,
      ArrowUp: current - 1,
      ArrowLeft: current - 1,
    }[event.key]
    if (next !== undefined) {
      event.preventDefault()
      pick(next > last ? 0 : next < 0 ? last : next, true)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      pick(event.key === 'Home' ? 0 : last, true)
    }
  }

  if (!shown.length) return null
  const Scene = processScenes[current]

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pauses the self-playing animation on hover
    <div
      className="flex flex-wrap items-stretch gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        role="tablist"
        aria-label="Étapes de la mission"
        aria-orientation="vertical"
        className="flex flex-[1_1_18.75rem] flex-col gap-2.5"
      >
        {shown.map((step, index) => {
          const selected = index === current
          return (
            <button
              key={step.id ?? step.title}
              ref={(el) => {
                tabs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`etape-tab-${index}`}
              aria-selected={selected}
              aria-controls="etape-ecran"
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(index)}
              onKeyDown={onKeyDown}
              className={`relative min-h-11 overflow-hidden rounded-[1.125rem] border px-5.5 py-5 text-left transition-[background,border-color] duration-300 ${selected ? 'border-[#cfccf7] bg-card shadow-[0_12px_28px_rgb(79_70_229/0.1)]' : 'border-transparent hover:bg-card/60'}`}
            >
              <span className="flex items-center gap-3.5">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full font-heading text-base font-semibold transition-colors duration-300 ${selected ? 'bg-primary text-primary-foreground' : 'bg-[#eeedfb] text-primary-strong'}`}
                >
                  {index + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <strong className="font-heading text-[1.0625rem] font-semibold">{step.title}</strong>
                  {step.text ? (
                    <span className="text-base leading-snug text-foreground-soft">{step.text}</span>
                  ) : null}
                </span>
              </span>
              {selected && auto ? (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.75 bg-[#eeedfb]">
                  <span
                    key={current}
                    className="block h-full animate-fill bg-primary"
                    style={{
                      animationDuration: `${processDurations[current]}ms`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div
        id="etape-ecran"
        role="tabpanel"
        aria-labelledby={`etape-tab-${current}`}
        className="flex min-w-0 flex-[999_1_35rem] flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_30px_60px_rgb(40_36_90/0.1)]"
      >
        <div
          aria-hidden="true"
          className="flex items-center gap-1.75 border-b border-[#eeeef3] bg-[#fafafc] px-4.5 py-3.5"
        >
          <span className="size-2.75 rounded-full bg-[#e3e4ec]" />
          <span className="size-2.75 rounded-full bg-[#e3e4ec]" />
          <span className="size-2.75 rounded-full bg-[#e3e4ec]" />
          <span className="ml-3.5 flex h-5.5 max-w-70 flex-1 items-center rounded-full bg-muted px-3 text-xs text-decor-muted">
            {shown[current]?.screenLabel}
          </span>
        </div>
        {/* Screen readers get the step in words; the illustration below is decorative. */}
        <p className="sr-only">
          Étape {current + 1} : {shown[current]?.title}. {shown[current]?.text}
        </p>
        {/* Decorative illustration of the step: replayed each time the step changes. */}
        <div
          ref={screen}
          aria-hidden="true"
          className="process-screen relative flex-1 overflow-hidden"
          style={{ minHeight: sceneHeight * scale }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: Math.max(panelWidth, sceneWidth),
              height: sceneHeight,
              transform: `scale(${scale})`,
            }}
          >
            <Scene key={current} />
          </div>
        </div>
      </div>
    </div>
  )
}
