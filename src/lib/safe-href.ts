// Links typed in the admin: site paths, anchors, web and mail links only (never `javascript:`…).
export const isSafeHref = (value: string) => /^(\/(?!\/)|#|https?:\/\/|mailto:)/i.test(value.trim())

// Payload `validate` for an optional link field.
export const validateHref = (value: unknown) =>
  !value ||
  (typeof value === 'string' && isSafeHref(value)) ||
  'Lien invalide : /page, #ancre, https://… ou mailto:…'
