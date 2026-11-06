'use client'

import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { processDurations, processScenes } from './process-scenes'

const [sceneWidth, sceneHeight] = [620, 460]

type Step = { id?: string | null; title: string; text?: string | null; screenLabel?: string | null }

// « Comment se déroule une mission »: steps as tabs, a screen that builds itself for the
// selected step. Plays by itself while on screen; a picked step restarts the bar from there,
// pauses while a tab has keyboard focus, never plays with reduced motion. The progress bar's
// own animation moves to the next step when it ends, so bar and steps never drift apart.
export function ProcessShowcase({ steps }: { steps: Step[] }) {
  const shown = steps.slice(0, processScenes.length)
  const [current, setCurrent] = useState(0)
  const [round, setRound] = useState(0)
  const [auto, setAuto] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)
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

  // Plays only while the block is on screen (otherwise it would be mid-way when reached).
  useEffect(() => {
    const el = root.current
    if (!el) return
    // On screen = any part of it in the top three quarters of the window: plays as soon as the
    // visitor reaches it, and doesn't stop / restart while the block is partly visible.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -25% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const playing = auto && visible && !focused && shown.length > 1
  const next = () => setCurrent((i) => (i + 1) % shown.length)

  // Picking a step shows it and the bar restarts from there (designer's choice), then it goes on.
  const pick = (index: number, focus = false) => {
    setCurrent(index)
    setRound((n) => n + 1)
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
    <div ref={root} className="flex flex-wrap items-stretch gap-8">
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
              // Keyboard focus pauses (time to read); a mouse click doesn't.
              onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
              onBlur={() => setFocused(false)}
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
              {selected && auto && shown.length > 1 ? (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.75 bg-[#eeedfb]">
                  <span
                    key={`${current}-${round}`}
                    className="block h-full origin-left bg-primary"
                    onAnimationEnd={next}
                    // Scaling (not width) keeps the fill smooth, even while the screen animates.
                    style={{
                      animation: `fill-scale ${processDurations[current]}ms linear both`,
                      animationPlayState: playing ? 'running' : 'paused',
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
        className="flex min-w-0 flex-[999_1_37.5rem] flex-col overflow-hidden rounded-3xl border bg-card shadow-[0_30px_60px_rgb(40_36_90/0.1)]"
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
        {/* Decorative illustration of the step: replayed each time a step is shown or picked. */}
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
            <Scene key={`${current}-${round}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
