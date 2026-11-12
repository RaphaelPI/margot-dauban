import type { ReactNode } from 'react'
import { MediaById } from '@/components/models/media-by-id'
import { RichTitle } from '@/components/rich-title'

// Client quote on the hero's colours (designs/42-temoignage-accueil, variant A: lilac top left,
// peach bottom right, no watermark quote mark). Bold text is highlighted in lilac. `compact`: a
// smaller text for a full testimonial of several paragraphs (project pages). `link`: shown on
// the right of the author (home page: the case study).
export function Testimonial({
  quote,
  author,
  role,
  company,
  photoId,
  link,
  compact = false,
}: {
  quote: unknown
  author?: string | null
  role?: string | null
  company?: string | null
  photoId?: string | null
  link?: ReactNode
  compact?: boolean
}) {
  return (
    <figure
      className={`relative flex flex-col overflow-hidden rounded-[2.25rem] bg-[#f3eef1] bg-[image:radial-gradient(520px_360px_at_8%_0,#dad8fa,rgb(243_238_241/0)_70%),radial-gradient(520px_380px_at_96%_100%,var(--peach),rgb(243_238_241/0)_70%)] ${compact ? 'gap-8 p-[clamp(1.75rem,5vw,4rem)]' : 'gap-9 p-[clamp(2.25rem,6vw,5rem)]'}`}
    >
      <blockquote
        className={
          compact
            ? 'relative flex flex-col gap-4 font-heading text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6] font-medium'
            : 'relative max-w-240 font-heading text-[clamp(1.5rem,3vw,2.375rem)] leading-[1.3] font-medium tracking-[-0.01em]'
        }
      >
        <RichTitle
          value={quote}
          quote
          paragraphClassName={compact ? 'block' : undefined}
          highlightClassName={`${compact ? 'rounded-md px-1' : 'rounded-xl px-2.5'} bg-accent text-foreground [box-decoration-break:clone]`}
        />
      </blockquote>
      {author || role || company || link ? (
        <figcaption className="relative flex flex-wrap items-center justify-between gap-6">
          <span className="flex items-center gap-4">
            {photoId ? (
              <span className="size-16 shrink-0 overflow-hidden rounded-full border-3 border-card bg-card shadow-[0_8px_20px_rgb(40_36_90/0.12)]">
                <MediaById id={photoId} sizes="64px" className="size-full object-cover" />
              </span>
            ) : null}
            <span className="flex flex-col gap-0.5">
              {author ? <strong className="text-[1.0625rem]">{author}</strong> : null}
              {role || company ? (
                <span className="text-base text-foreground-soft">
                  {[role, company].filter(Boolean).join(' · ')}
                </span>
              ) : null}
            </span>
          </span>
          {link}
        </figcaption>
      ) : null}
    </figure>
  )
}
