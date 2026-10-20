export const emptyFilters = { min: '', max: '', size: '', sort: 'newest' }

export function applyFilters(list, f) {
  let out = list.filter(
    (p) =>
      (f.min === '' || p.price >= Number(f.min)) &&
      (f.max === '' || p.price <= Number(f.max)) &&
      (f.size === '' || p.sizes.includes(f.size))
  )
  if (f.sort === 'price') {
    out = [...out].sort((a, b) => a.price - b.price)
  }
  return out
}