import 'server-only'
import config from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'

// Local API, server only. The browser never talks to Payload for site content.
export const getPayload = () => getPayloadInstance({ config })
