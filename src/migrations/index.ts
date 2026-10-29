import * as migration_20261029_141409_remove_testimonials from './20261029_141409_remove_testimonials'

export const migrations = [
  {
    up: migration_20261029_141409_remove_testimonials.up,
    down: migration_20261029_141409_remove_testimonials.down,
    name: '20261029_141409_remove_testimonials',
  },
]
