import { permanentRedirect } from 'next/navigation'

// The page moved to /expertises (designer's request): old links, bookmarks and search results
// are sent there permanently (308).
export default function FormerServicesPage() {
  permanentRedirect('/expertises')
}
