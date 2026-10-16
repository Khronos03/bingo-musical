import { create } from 'zustand';
import { generateUniqueBingoCards } from '@/utils/cardGenerator';
import { exportToPDF, exportCardToPNG } from '@/utils/exportUtils';
import { persistCards, persistSongs } from '@/utils/dataPersistence';
import songsData from '@/data/songs.json';
import cardsData from '@/data/cards.json';
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
    songs: songsData,
    cards: cardsData,
    currentSongIndex: null,
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
            persistSongs(newSongs);
            return { songs: newSongs };
        });
    },
    editSong: (id, title) => {
        set((state) => {
            const newSongs = state.songs.map((song) => song.id === id ? { ...song, title: title.trim() } : song);
            persistSongs(newSongs);
            return { songs: newSongs };
        });
    },
    deleteSong: (id) => {
        set((state) => {
            const newSongs = state.songs.filter((song) => song.id !== id);
            persistSongs(newSongs);
            return { songs: newSongs };
        });
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
            const songs = [...state.songs, ...newSongs];
            persistSongs(songs);
            return { songs };
        });
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
                const cards = [...state.cards, ...cardsWithNumbers];
                persistCards(cards);
                return { cards };
            });
            return true;
        }
        catch {
            return false;
        }
    },
    clearCards: () => {
        set({ cards: [] });
        persistCards([]);
    },
    exportCardsToPDF: async () => {
        const state = get();
        await exportToPDF(state.cards, state.songs, state.playedSongs);
    },
    exportCardToPNG: async (cardId) => {
        const state = get();
        const card = state.cards.find((c) => c.id === cardId);
        if (card) {
            await exportCardToPNG(card, state.songs, state.playedSongs);
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
        set({ currentSongIndex: null, playedSongs: new Set(), winningCardId: null });
    },
    toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
    },
}));
