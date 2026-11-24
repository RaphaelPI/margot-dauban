'use client'

import { Button, PlusIcon, useConfig, useDocumentInfo } from '@payloadcms/ui'

// Admin, next to « Enregistrer » / « Publier » on an existing entry: start the next one without
// going back to the list (testimonials, FAQ, logos… entered one after the other).
export function CreateNewButton() {
  const { collectionSlug, id } = useDocumentInfo()
  const {
    config: {
      routes: { admin },
    },
  } = useConfig()
  if (!collectionSlug || !id) return null
  return (
    <Button
      el="link"
      url={`${admin}/collections/${collectionSlug}/create`}
      buttonStyle="secondary"
      size="medium"
      margin={false}
      icon={<PlusIcon />}
      iconPosition="left"
    >
      Nouveau
    </Button>
  )
}
