import 'server-only'
import { draftMode } from 'next/headers'

// Draft preview (« Aperçu » in the admin → /apercu): while Next's draft mode is on, the site reads
// the latest drafts instead of the published versions. Readable inside 'use cache' scopes: Next
// re-runs them on every draft request and never stores the result (docs: use-cache › Draft Mode).
export const isPreview = async () => (await draftMode()).isEnabled

export { isShown, withoutPublishedFilter } from './preview-filter'
