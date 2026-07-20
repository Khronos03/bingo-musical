import type { Song } from '@/types'

export async function persistSongs(songs: Song[]) {
  const env = (import.meta as any).env
  if (!env?.DEV) {
    return
  }

  try {
    await fetch('/__bingo-data/save-songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songs }),
    })
  } catch {
    // Ignore persistence errors in the browser
  }
}

export async function persistCards(cards: unknown[]) {
  const env = (import.meta as any).env
  if (!env?.DEV) {
    return
  }

  try {
    await fetch('/__bingo-data/save-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards }),
    })
  } catch {
    // Ignore persistence errors in the browser
  }
}
