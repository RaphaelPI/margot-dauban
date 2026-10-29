import type { Access } from 'payload'

export const loggedIn: Access = ({ req }) => Boolean(req.user)

// Anyone reads published docs; logged-in editors also read drafts.
export const publishedOrLoggedIn: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
