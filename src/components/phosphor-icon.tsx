import 'server-only'
import * as Phosphor from '@phosphor-icons/react/ssr'
import type { ComponentType, SVGProps } from 'react'
import { iconComponentName } from '@/lib/icon-name'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; weight?: string }>
const icons = Phosphor as unknown as Record<string, IconComponent | undefined>

// Decorative Phosphor icon picked by name in the admin (rendered on the server: no icon code
// reaches the browser). Unknown names render nothing.
export function PhosphorIcon({ name, className }: { name: string | null | undefined; className?: string }) {
  const key = iconComponentName(name)
  const Icon = key && Object.hasOwn(icons, key) ? icons[key] : undefined
  return Icon ? <Icon aria-hidden="true" size="1.5em" weight="regular" className={className} /> : null
}
