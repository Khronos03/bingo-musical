import { create } from 'zustand';
import { generateUniqueBingoCards } from '@/utils/cardGenerator';
import { exportToPDF, exportCardToPNG } from '@/utils/exportUtils';
const STORAGE_KEY = 'bingo-musical-data';
function findWinningCardId(cards, songs, playedSongIds) {
    const playedTitles = new Set(songs
        .filter((song) => playedSongIds.has(song.id))
        .map((song) => song.title));
    for (const card of cards) {
        const isWinner = card.songs.every((title) => playedTitles.has(title));
        if (isWinner) {
            return card.id;
        }
    }
    return null;
}
export const useBingoStore = create((set, get) => ({
    songs: [],
    cards: [],
    currentSongIndex: 0,
    playedSongs: new Set(),
    winningCardId: null,
    isDarkMode: true,
    addSong: (title) => {
        set((state) => {
            const newSong = {
                id: Date.now().toString(),
                title: title.trim(),
                addedAt: Date.now(),
            };
            const newSongs = [...state.songs, newSong];
            return { songs: newSongs };
        });
        get().saveToStorage();
    },
    editSong: (id, title) => {
        set((state) => {
            const newSongs = state.songs.map((song) => song.id === id ? { ...song, title: title.trim() } : song);
            return { songs: newSongs };
        });
        get().saveToStorage();
    },
    deleteSong: (id) => {
        set((state) => {
            const newSongs = state.songs.filter((song) => song.id !== id);
            return { songs: newSongs };
        });
        get().saveToStorage();
    },
    importSongs: (titles) => {
        set((state) => {
            const newSongs = titles
                .map((title) => title.trim())
                .filter((title) => title.length > 0)
                .map((title) => ({
                id: Date.now().toString() + Math.random(),
                title,
                addedAt: Date.now(),
            }));
            return { songs: [...state.songs, ...newSongs] };
        });
        get().saveToStorage();
    },
    generateCards: async (count) => {
        const state = get();
        if (state.songs.length < 7) {
            return false;
        }
        try {
            const newCards = generateUniqueBingoCards(state.songs.map((s) => s.title), count);
            set((state) => {
                const startNumber = state.cards.length + 1;
                const cardsWithNumbers = newCards.map((card, index) => ({
                    ...card,
                    id: `card-${Date.now()}-${index}`,
                    cardNumber: startNumber + index,
                    createdAt: Date.now(),
                }));
                return { cards: [...state.cards, ...cardsWithNumbers] };
            });
            get().saveToStorage();
            return true;
        }
        catch {
            return false;
        }
    },
    clearCards: () => {
        set({ cards: [] });
        get().saveToStorage();
    },
    exportCardsToPDF: async () => {
        const state = get();
        await exportToPDF(state.cards);
    },
    exportCardToPNG: async (cardId) => {
        const state = get();
        const card = state.cards.find((c) => c.id === cardId);
        if (card) {
            await exportCardToPNG(card);
        }
    },
    playNextSong: () => {
        set((state) => {
            const playedSet = new Set(state.playedSongs);
            const unplayedSongs = state.songs.filter((s) => !playedSet.has(s.id));
            if (unplayedSongs.length === 0) {
                return { currentSongIndex: null, playedSongs: new Set(), winningCardId: null };
            }
            const randomIndex = Math.floor(Math.random() * unplayedSongs.length);
            const selectedSong = unplayedSongs[randomIndex];
            playedSet.add(selectedSong.id);
            const winningCardId = findWinningCardId(state.cards, state.songs, playedSet);
            const newIndex = state.songs.findIndex((s) => s.id === selectedSong.id);
            return {
                currentSongIndex: newIndex,
                playedSongs: playedSet,
                winningCardId,
            };
        });
        const stateAfter = get();
        return stateAfter.songs[stateAfter.currentSongIndex ?? -1]?.title || null;
    },
    resetPlayback: () => {
        set({ currentSongIndex: 0, playedSongs: new Set(), winningCardId: null });
    },
    toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        get().saveToStorage();
    },
    saveToStorage: () => {
        const state = get();
        const dataToSave = {
            songs: state.songs,
            cards: state.cards,
            isDarkMode: state.isDarkMode,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    },
    loadFromStorage: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                set({
                    songs: parsed.songs || [],
                    cards: parsed.cards || [],
                    isDarkMode: parsed.isDarkMode ?? true,
                });
            }
            catch {
                console.error('Failed to load data from storage');
            }
        }
    },
    hydrate: () => {
        get().loadFromStorage();
    },
}));
// Hydrate store on initialization
if (typeof window !== 'undefined') {
    useBingoStore.getState().hydrate();
}
