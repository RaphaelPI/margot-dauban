import * as migration_20261029_141409_remove_testimonials from './20261029_141409_remove_testimonials'
import * as migration_20261102_140000_order_projects from './20261102_140000_order_projects'
import * as migration_20261124_120000_media_sizes from './20261124_120000_media_sizes'

export const migrations = [
  {
    up: migration_20261029_141409_remove_testimonials.up,
    down: migration_20261029_141409_remove_testimonials.down,
    name: '20261029_141409_remove_testimonials',
  },
  {
    up: migration_20261102_140000_order_projects.up,
    down: migration_20261102_140000_order_projects.down,
    name: '20261102_140000_order_projects',
  },
  {
    up: migration_20261124_120000_media_sizes.up,
    down: migration_20261124_120000_media_sizes.down,
    name: '20261124_120000_media_sizes',
  },
]
