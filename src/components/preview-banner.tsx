import { draftMode } from 'next/headers'
import { PreviewExit } from '@/components/preview-exit'

// Shown only to an editor previewing drafts (/apercu): reminds them the page isn't the live one.
// Reads runtime data: render inside <Suspense>.
export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-foreground py-2.5 pr-2.5 pl-5 text-base text-white shadow-[0_14px_30px_rgb(18_24_20/0.25)]"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="size-2 rounded-full bg-peach" />
        Aperçu : brouillons visibles
      </span>
      <PreviewExit />
    </div>
  )
}
