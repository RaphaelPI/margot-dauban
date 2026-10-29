import { ProjectCard } from '@/components/models/project-card'
import { getProjectIds } from '@/data/projects'
import { getSettings } from '@/data/settings'

export default async function HomePage() {
  const [settings, projectIds] = await Promise.all([getSettings(), getProjectIds()])

  return (
    <div className="flex flex-col gap-16 pt-12">
      <section className="flex max-w-2xl flex-col gap-4">
        <h1 className="font-heading text-5xl font-semibold tracking-tight">{settings.tagline}</h1>
        {settings.intro ? <p className="text-lg text-muted-foreground">{settings.intro}</p> : null}
      </section>
      <section aria-labelledby="projets" className="flex flex-col gap-6">
        <h2 id="projets" className="font-heading text-2xl font-semibold">
          Projets
        </h2>
        {projectIds.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projectIds.map((id) => (
              <ProjectCard key={id} id={id} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun projet publié pour le moment.</p>
        )}
      </section>
    </div>
  )
}
