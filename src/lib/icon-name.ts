// Phosphor icon name as typed or copied from phosphoricons.com ("arrow-up-right", "Arrow up right",
// "ArrowUpRight", "<ArrowUpRight />") → component name ("ArrowUpRight"). Null when it can't be one.
export function iconComponentName(input: string | null | undefined): string | null {
  const words = (input ?? '')
    .replace(/^<\s*|\s*\/?>$/g, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
  if (!words.length || words.some((word) => !/^[A-Za-z0-9]+$/.test(word))) return null
  const name = words.map((word) => word[0].toUpperCase() + word.slice(1)).join('')
  return /^[A-Z]/.test(name) ? name : null
}
