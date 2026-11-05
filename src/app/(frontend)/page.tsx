import { ArrowLink } from '@/components/arrow-link'
import { CtaLink } from '@/components/cta-link'
import { GlowCard } from '@/components/glow-card'
import { HeroDecor } from '@/components/hero-decor'
import { ClientName } from '@/components/models/client-name'
import { MediaById } from '@/components/models/media-by-id'
import { ProjectCard } from '@/components/models/project-card'
import { ServiceCard } from '@/components/models/service-card'
import { RichTextOrPlain } from '@/components/rich-text-or-plain'
import { getClientIds, getFeaturedProjectIds, getHomeServiceIds } from '@/data/ids'
import { getHome } from '@/data/settings'

const asId = (value: string | { id: string }) => (typeof value === 'string' ? value : value.id)

// Rich text of the « À propos » section: paragraphs, lists, bold indigo underlined links.
const aboutText =
  'text-base leading-[1.75] [&_*+*]:mt-4 [&_a]:font-bold [&_a]:text-primary-strong [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4 [&_li+li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6'

const h2 = 'font-heading text-[1.875rem] leading-tight font-semibold tracking-[-0.02em] md:text-[2.375rem]'

export default async function HomePage() {
  const [home, featuredIds, clientIds, serviceIds] = await Promise.all([
    getHome(),
    getFeaturedProjectIds(),
    getClientIds(),
    getHomeServiceIds(),
  ])
  const projectIds = home.projects?.items?.length ? home.projects.items.map(asId) : featuredIds
  const testimonial = home.testimonial?.quote ? home.testimonial : null
  const about = home.about?.title ? home.about : null
  const aboutImage = about?.image ? asId(about.image) : null

  return (
    <>
      {/* Indigo & peach glow behind the header and hero (body is the positioned ancestor). */}
      <div aria-hidden="true" className="bg-hero absolute inset-x-0 top-0 -z-10 h-[1400px]" />

      <section className="relative pt-16 pb-20 md:pt-30 md:pb-32.5">
        <HeroDecor />
        <div className="relative mx-auto flex max-w-190 flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-[clamp(2.125rem,4.4vw,3.625rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
            {home.hero.title}{' '}
            {home.hero.highlight ? (
              <span className="rounded-[0.875rem] bg-accent px-3 md:whitespace-nowrap">
                {home.hero.highlight}
              </span>
            ) : null}
          </h1>
          {home.hero.intro ? (
            <p className="max-w-140 text-lg leading-normal text-foreground-soft md:text-xl">
              {home.hero.intro}
            </p>
          ) : null}
          {home.hero.ctaLabel && home.hero.ctaHref ? (
            <CtaLink href={home.hero.ctaHref}>{home.hero.ctaLabel}</CtaLink>
          ) : null}
        </div>
      </section>

      {home.stats?.length || clientIds.length ? (
        <section
          aria-label="Références clients"
          className="flex flex-wrap items-center gap-x-10 gap-y-5 rounded-3xl border bg-card px-6 py-5 md:rounded-full md:px-9 md:py-4.5"
        >
          {home.stats?.length ? (
            <dl className="flex shrink-0 flex-wrap gap-x-8 gap-y-4">
              {home.stats.map((stat) => (
                <div key={stat.id ?? stat.label} className="flex flex-row-reverse items-center gap-2.5">
                  <dt className="max-w-26 text-sm leading-snug text-muted-foreground">{stat.label}</dt>
                  <dd className="font-heading text-[2rem] leading-none font-semibold text-primary">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {clientIds.length ? (
            <div className="min-w-0 flex-[1_1_26rem] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
              <div className="flex w-max animate-marquee text-muted-foreground motion-reduce:animate-none">
                <ul className="flex items-center gap-13 pr-13">
                  {clientIds.map((id) => (
                    <li key={id}>
                      <ClientName id={id} />
                    </li>
                  ))}
                </ul>
                {/* Second copy for a seamless loop: hidden from screen readers. */}
                <ul aria-hidden="true" className="flex items-center gap-13 pr-13">
                  {clientIds.map((id) => (
                    <li key={id}>
                      <ClientName id={id} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section
        id="projets"
        aria-labelledby="projets-titre"
        className="flex flex-col gap-9 pt-20 pb-10 md:pt-28"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="projets-titre" className={h2}>
            {home.projects?.title}
          </h2>
          {home.projects?.linkLabel ? <ArrowLink href="/projets">{home.projects.linkLabel}</ArrowLink> : null}
        </div>
        {projectIds.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projectIds.map((id) => (
              <ProjectCard key={id} id={id} home />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
        )}
      </section>

      {about ? (
        // « À propos » (designs/40-a-propos-accueil): image on the side chosen in the admin, text
        // first on phones.
        <section
          aria-labelledby="a-propos-titre"
          className="grid items-center gap-12 pt-16 pb-10 md:grid-cols-2 md:gap-12 md:pt-24 lg:gap-16"
        >
          <div className="flex flex-col gap-5">
            {about.eyebrow ? (
              <span className="self-start rounded-full border border-border/50 bg-card px-4 py-1.5 text-base font-semibold">
                {about.eyebrow}
              </span>
            ) : null}
            <h2 id="a-propos-titre" className={`${h2} text-balance`}>
              {about.title}{' '}
              {about.highlight ? (
                <span className="rounded-[0.75rem] bg-[#e2e1ff] px-2.5 [box-decoration-break:clone]">
                  {about.highlight}
                </span>
              ) : null}
            </h2>
            {about.lead ? (
              <RichTextOrPlain
                value={about.lead}
                className={`${aboutText} text-lg font-semibold text-foreground`}
              />
            ) : null}
            {about.body ? (
              <RichTextOrPlain value={about.body} className={`${aboutText} text-foreground-soft`} />
            ) : null}
            {about.callout ? (
              <RichTextOrPlain
                value={about.callout}
                className={`${aboutText} border-t border-[#e3e4ec] pt-5 text-foreground-soft`}
              />
            ) : null}
          </div>
          {aboutImage ? (
            <div
              className={`aspect-[4/5] overflow-hidden rounded-[2rem] border bg-[radial-gradient(420px_circle_at_20%_15%,#dad8fa,rgb(218_216_250/0)_70%),radial-gradient(420px_circle_at_85%_90%,#fce1d3,rgb(252_225_211/0)_70%),#f3f1f7] ${about.imagePosition === 'right' ? '' : 'md:order-first'}`}
            >
              <MediaById
                id={aboutImage}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="size-full object-cover"
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {testimonial ? (
        <section id="temoignages" aria-label="Témoignage" className="pt-16 pb-10 md:pt-24">
          <figure className="flex flex-col gap-7 rounded-[2rem] bg-ink p-8 text-ink-foreground md:p-14">
            <blockquote className="max-w-240 font-heading text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.35] font-medium">
              « {testimonial.quote}
              {testimonial.highlight ? <span className="text-lilac"> {testimonial.highlight}</span> : null} »
            </blockquote>
            {testimonial.author || testimonial.company ? (
              <figcaption className="flex flex-wrap justify-between gap-4 border-t border-ink-border pt-4 text-[0.9375rem]">
                <span>
                  {testimonial.author ? <strong>{testimonial.author}</strong> : null}
                  {testimonial.role ? <span className="block text-ink-muted">{testimonial.role}</span> : null}
                </span>
                {testimonial.company ? (
                  <span className="font-bold text-ink-muted">{testimonial.company}</span>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        </section>
      ) : null}

      {serviceIds.length ? (
        <section aria-labelledby="expertises-titre" className="flex flex-col gap-9 pt-16 pb-10 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="expertises-titre" className={h2}>
              {home.expertise?.title}
            </h2>
            {home.expertise?.linkLabel ? (
              <ArrowLink href="/prestations">{home.expertise.linkLabel}</ArrowLink>
            ) : null}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceIds.map((id) => (
              <ServiceCard key={id} id={id} short />
            ))}
          </div>
        </section>
      ) : null}

      {home.cta?.title ? (
        <section className="pt-14">
          <GlowCard
            as="div"
            className="flex flex-wrap items-center justify-between gap-8 rounded-[2rem] bg-primary px-7 py-12 text-primary-foreground [--glow-from:rgb(140_133_255/0.85)] [--glow-mid:rgb(120_112_250/0.35)] [--glow-size:520px] hover:shadow-[0_20px_44px_rgb(79_70_229/0.22)] md:px-12 md:py-18"
          >
            <div className="flex max-w-180 flex-col gap-2.5">
              <h2 className="font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-bold tracking-[-0.02em]">
                {home.cta.title}
              </h2>
              {home.cta.text ? <p className="text-lg">{home.cta.text}</p> : null}
            </div>
            {home.cta.buttonLabel && home.cta.buttonHref ? (
              <CtaLink href={home.cta.buttonHref} tone="black">
                {home.cta.buttonLabel}
              </CtaLink>
            ) : null}
          </GlowCard>
        </section>
      ) : null}
    </>
  )
}
