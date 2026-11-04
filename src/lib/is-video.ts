import type { Media } from '@/payload-types'

// A populated media doc holding a video (MP4…), shown with LoopVideo instead of an image.
export const isVideo = (media: unknown): boolean =>
  typeof media === 'object' &&
  media !== null &&
  Boolean((media as Media).url) &&
  Boolean((media as Media).mimeType?.startsWith('video/'))
