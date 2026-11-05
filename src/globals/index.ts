import { withGlobalRevalidation } from '../lib/cache'
import { ContactPage } from './ContactPage'
import { FaqPage } from './FaqPage'
import { Home } from './Home'
import { ProjectsPage } from './ProjectsPage'
import { ServicesPage } from './ServicesPage'
import { Settings } from './Settings'

// Registered globals (admin order). Adding one here is a content model change, not a
// critical one: the designer can validate it. Every global gets the revalidation hooks.
export const globals = [Home, ProjectsPage, ServicesPage, FaqPage, ContactPage, Settings].map(
  withGlobalRevalidation,
)
