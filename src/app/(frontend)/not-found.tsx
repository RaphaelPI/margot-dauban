import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 pt-12">
      <h1 className="font-heading text-3xl font-semibold">Page introuvable</h1>
      <Button asChild variant="outline">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  )
}
