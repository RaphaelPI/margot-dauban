// Item after `current`, wrapping to the first; null when there is no other item.
export function nextInList<T>(list: readonly T[], current: T): T | null {
  const index = list.indexOf(current)
  if (index === -1 || list.length < 2) return null
  return list[(index + 1) % list.length] ?? null
}
