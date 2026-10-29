import Link from 'next/link'
import { ClientName } from '@/components/models/client-name'
import { ProjectCard } from '@/components/models/project-card'
import { ServiceCard } from '@/components/models/service-card'
import { TestimonialQuote } from '@/components/models/testimonial-quote'
import { Button } from '@/components/ui/button'
import { getClientIds, getFeaturedProjectIds, getHomeServiceIds } from '@/data/ids'
import { getHome } from '@/data/settings'

const asId = (value: string | { id: string }) => (typeof value === 'string' ? value : value.id)

export default async function HomePage() {
  const [home, featuredIds, clientIds, serviceIds] = await Promise.all([
    getHome(),
    getFeaturedProjectIds(),
    getClientIds(),
    getHomeServiceIds(),
  ])
  const projectIds = home.projects?.items?.length ? home.projects.items.map(asId) : featuredIds

  return (
    <div className="flex flex-col gap-24 pt-12">
      <section className="flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-5xl font-semibold tracking-tight md:text-6xl">
          {home.hero.title}{' '}
          {home.hero.highlight ? <span className="text-primary">{home.hero.highlight}</span> : null}
        </h1>
        {home.hero.intro ? <p className="text-lg text-muted-foreground">{home.hero.intro}</p> : null}
        {home.hero.ctaLabel && home.hero.ctaHref ? (
          <Button asChild size="lg" className="self-start">
            <Link href={home.hero.ctaHref}>{home.hero.ctaLabel}</Link>
          </Button>
        ) : null}
      </section>

      {home.stats?.length || clientIds.length ? (
        <section aria-label="Références clients" className="flex flex-col gap-8">
          {home.stats?.length ? (
            <dl className="flex flex-wrap gap-12">
              {home.stats.map((stat) => (
                <div key={stat.id ?? stat.label} className="flex flex-col-reverse">
                  <dt className="text-muted-foreground">{stat.label}</dt>
                  <dd className="font-heading text-4xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {clientIds.length ? (
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-4 text-muted-foreground">
              {clientIds.map((id) => (
                <li key={id}>
                  <ClientName id={id} />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section id="projets" aria-labelledby="projets-titre" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="projets-titre" className="font-heading text-3xl font-semibold">
            {home.projects?.title}
          </h2>
          {home.projects?.linkLabel ? (
            <Link href="/projets" className="text-sm font-medium hover:text-primary">
              {home.projects.linkLabel} →
            </Link>
          ) : null}
        </div>
        {projectIds.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {projectIds.map((id) => (
              <ProjectCard key={id} id={id} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
        )}
      </section>

      {home.testimonial ? (
        <section id="temoignages" aria-label="Témoignage">
          <TestimonialQuote id={asId(home.testimonial)} />
        </section>
      ) : null}

      {serviceIds.length ? (
        <section aria-labelledby="expertises-titre" className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="expertises-titre" className="font-heading text-3xl font-semibold">
              {home.expertise?.title}
            </h2>
            {home.expertise?.linkLabel ? (
              <Link href="/prestations" className="text-sm font-medium hover:text-primary">
                {home.expertise.linkLabel} →
              </Link>
            ) : null}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {serviceIds.map((id) => (
              <ServiceCard key={id} id={id} short />
            ))}
          </div>
        </section>
      ) : null}

      {home.cta?.title ? (
        <section className="flex flex-col items-start gap-4 rounded-2xl bg-primary p-10 text-primary-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-3xl font-semibold">{home.cta.title}</h2>
            {home.cta.text ? <p className="opacity-80">{home.cta.text}</p> : null}
          </div>
          {home.cta.buttonLabel && home.cta.buttonHref ? (
            <Button asChild variant="secondary" size="lg">
              <Link href={home.cta.buttonHref}>{home.cta.buttonLabel}</Link>
            </Button>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
