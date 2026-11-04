import { withRevalidation } from '../lib/cache'
import { Clients } from './Clients'
import { Faqs } from './Faqs'
import { Media } from './Media'
import { Pages } from './Pages'
import { ProjectCategories } from './ProjectCategories'
import { Projects } from './Projects'
import { Services } from './Services'
import { Users } from './Users'

// Registered collections (admin order). Adding one here is a content model change, not a
// critical one: the designer can validate it. Every collection gets the revalidation hooks.
export const collections = [Projects, ProjectCategories, Clients, Services, Faqs, Pages, Media, Users].map(
  withRevalidation,
)
