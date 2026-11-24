import type { CollectionConfig } from 'payload'
import { withRevalidation } from '../lib/cache'
import { Clients } from './Clients'
import { ContactMessages } from './ContactMessages'
import { Faqs } from './Faqs'
import { Media } from './Media'
import { Pages } from './Pages'
import { ProjectCategories } from './ProjectCategories'
import { Projects } from './Projects'
import { Services } from './Services'
import { Testimonials } from './Testimonials'
import { Users } from './Users'

// « Nouveau » button next to « Publier » on an entry (src/components/admin/create-new-button.tsx):
// for the lists filled in one entry after another.
const withCreateNewButton = (config: CollectionConfig): CollectionConfig => ({
  ...config,
  admin: {
    ...config.admin,
    components: {
      ...config.admin?.components,
      edit: {
        ...config.admin?.components?.edit,
        beforeDocumentControls: [
          ...(config.admin?.components?.edit?.beforeDocumentControls ?? []),
          '@/components/admin/create-new-button#CreateNewButton',
        ],
      },
    },
  },
})

// Registered collections (admin order). Adding one here is a content model change, not a
// critical one: the designer can validate it. Every collection gets the revalidation hooks.
export const collections = [
  ...[Projects, ProjectCategories, Testimonials, Clients, Services, Faqs, Pages].map(withCreateNewButton),
  ContactMessages,
  Media,
  Users,
].map(withRevalidation)
