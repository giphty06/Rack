export function toInternational(input) {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('234')) return '+' + digits
  if (digits.startsWith('0')) return '+234' + digits.slice(1)
  return '+234' + digits
}

export function isValid(input) {
  return /^\+234\d{10}$/.test(toInternational(input))
}