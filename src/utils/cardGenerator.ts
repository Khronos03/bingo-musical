import type { BingoCard } from '@/types'

export function generateUniqueBingoCards(
  songs: string[],
  count: number,
): Omit<BingoCard, 'id' | 'cardNumber' | 'createdAt'>[] {
  if (songs.length < 7) {
    throw new Error('Se necesitan al menos 7 canciones para generar cartas')
  }

  const GRID_SIZE = 8

  const generatedCards: Omit<BingoCard, 'id' | 'cardNumber' | 'createdAt'>[] = []
  const cardSignatures = new Set<string>()

  const maxPossibleCombinations = calculateMaxCombinations(songs.length)
  if (count > maxPossibleCombinations) {
    throw new Error(
      `Solo es posible generar ${maxPossibleCombinations} cartas únicas`,
    )
  }

  let attempts = 0
  const maxAttempts = count * 100

  while (generatedCards.length < count && attempts < maxAttempts) {
    attempts++

    const freePosition = Math.floor(Math.random() * GRID_SIZE)
    const selectedSongs: string[] = []

    const availableSongs = [...songs]
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      const randomIndex = Math.floor(Math.random() * availableSongs.length)
      selectedSongs.push(availableSongs[randomIndex])
      availableSongs.splice(randomIndex, 1)
    }

    const songSet = new Set(selectedSongs)
    const signature = createSignature(songSet, freePosition)

    if (!cardSignatures.has(signature)) {
      cardSignatures.add(signature)
      generatedCards.push({
        songs: selectedSongs,
        freePosition,
      })
    }
  }

  if (generatedCards.length < count) {
    throw new Error(
      `No fue posible generar ${count} cartas únicas. Máximo posible: ${generatedCards.length}`,
    )
  }

  return generatedCards
}

function createSignature(songSet: Set<string>, freePosition: number): string {
  const sortedSongs = Array.from(songSet).sort().join('|')
  return `${sortedSongs}:${freePosition}`
}

function calculateMaxCombinations(songCount: number): number {
  if (songCount < 7) return 0

  const occupied_cells = 7
  const free_positions = 8

  let combinations = 1

  for (let i = 0; i < occupied_cells; i++) {
    combinations *= songCount - i
  }

  for (let i = 1; i <= occupied_cells; i++) {
    combinations /= i
  }

  combinations *= free_positions

  return Math.floor(combinations)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
