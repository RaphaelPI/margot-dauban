// Order key in Payload's fractional-indexing format (orderable collections): 'a' + one base-62
// digit, then 'b' + two digits — strictly increasing for 3,906 items.
const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const orderKey = (index: number) =>
  index < 62 ? `a${digits[index]}` : `b${digits[Math.floor(index / 62) - 1]}${digits[index % 62]}`
