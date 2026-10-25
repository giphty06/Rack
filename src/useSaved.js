import { useSyncExternalStore } from 'react'

const KEY = 'rack-saved'
const listeners = new Set()

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let current = read()

function write(next) {
  current = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage unavailable, keep the list in memory only
  }
  listeners.forEach((l) => l())
}

function subscribe(l) {
  listeners.add(l)
  return () => listeners.delete(l)
}

function snapshot() {
  return current
}

export function useSaved() {
  const ids = useSyncExternalStore(subscribe, snapshot)
  return {
    ids,
    isSaved: (id) => ids.includes(id),
    toggle: (id) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    remove: (id) => write(ids.filter((x) => x !== id)),
    clear: () => write([]),
  }
}