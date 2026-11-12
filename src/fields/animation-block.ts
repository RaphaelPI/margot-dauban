import type { Block } from 'payload'

// Custom coded animations, inserted in a step's detailed text. Each value maps to a component
// in `src/components/animations` (see `stepConverters` in `project-view.tsx`).
export const animationOptions = [
  { label: 'Le Bikini — page d’accueil modulable', value: 'bikini-homepage' },
] as const

export type AnimationName = (typeof animationOptions)[number]['value']

export const AnimationBlock: Block = {
  slug: 'animation',
  interfaceName: 'AnimationBlock',
  labels: { singular: 'Animation', plural: 'Animations' },
  fields: [
    {
      name: 'animation',
      label: 'Animation',
      type: 'select',
      required: true,
      options: [...animationOptions],
      admin: { description: 'Animation codée sur mesure : elle tourne en boucle, avec un bouton Pause.' },
    },
  ],
}
