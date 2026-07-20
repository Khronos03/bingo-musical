export interface Song {
  id: string
  title: string
  addedAt: number
}

export interface BingoCard {
  id: string
  cardNumber: number
  songs: string[]
  freePosition: number
  createdAt: number
}

export interface BingoState {
  songs: Song[]
  cards: BingoCard[]
  currentSongIndex: number | null
  playedSongs: Set<string>
  winningCardId: string | null
  isDarkMode: boolean
  
  addSong: (title: string) => void
  editSong: (id: string, title: string) => void
  deleteSong: (id: string) => void
  importSongs: (titles: string[]) => void
  
  generateCards: (count: number) => Promise<boolean>
  clearCards: () => void
  exportCardsToPDF: () => Promise<void>
  exportCardToPNG: (cardId: string) => Promise<void>
  
  playNextSong: () => string | null
  resetPlayback: () => void
  
  toggleDarkMode: () => void
}

export interface PlaybackState {
  currentSongIndex: number
  playedSongs: string[]
  totalSongs: number
}
