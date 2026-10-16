import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useBingoStore } from '@/store/bingoStore';
import BingoCard from '@/components/BingoCard';
import { Play, Pause, RotateCcw, AlertCircle, } from 'lucide-react';
export default function PlaybackMode() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [interval, setInterval] = useState(3);
    const { songs, cards, currentSongIndex, playedSongs, winningCardId, playNextSong, resetPlayback, } = useBingoStore();
    useEffect(() => {
        if (autoPlay && isPlaying && songs.length > 0) {
            const timer = setTimeout(() => {
                playNextSong();
            }, interval * 1000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, autoPlay, interval, songs.length, currentSongIndex, playNextSong]);
    const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;
    const playedCount = playedSongs.size;
    const remainingCount = songs.length - playedCount;
    const isFinished = playedCount === songs.length && songs.length > 0;
    const winningCard = cards.find((card) => card.id === winningCardId);
    const handlePlayNext = () => {
        if (songs.length > 0) {
            playNextSong();
            setIsPlaying(true);
        }
    };
    const handleReset = () => {
        resetPlayback();
        setIsPlaying(false);
    };
    if (songs.length === 0) {
        return (_jsxs("div", { className: "card text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400 text-lg mb-2", children: "No hay canciones agregadas" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Agrega canciones en la secci\u00F3n \"Canciones\" para poder usar el modo reproducci\u00F3n" })] }));
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Modo Reproducci\u00F3n" }), _jsxs("p", { className: "text-gray-400 mb-6", children: ["Canciones disponibles: ", songs.length] }), isFinished && (_jsx("div", { className: "bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-blue-200 text-center font-semibold", children: "\u2713 Se han reproducido todas las canciones" }) })), _jsxs("div", { className: "bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/50 rounded-lg p-8 text-center mb-8", children: [_jsx("p", { className: "text-gray-400 text-sm mb-2", children: "Canci\u00F3n Actual" }), _jsx("h3", { className: "text-4xl font-bold text-white mb-4 min-h-16 flex items-center justify-center", children: currentSong ? currentSong.title : 'Presiona play' }), _jsxs("div", { className: "flex gap-4 justify-center flex-wrap", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Reproducidas" }), _jsx("p", { className: "text-3xl font-bold text-primary", children: playedCount })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Restantes" }), _jsx("p", { className: "text-3xl font-bold text-secondary", children: remainingCount })] })] })] }), winningCard && (_jsxs("div", { className: "card border border-green-500 bg-green-950/10 p-6 mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-green-200 mb-2", children: "\u00A1Tenemos Ganador!" }), _jsxs("p", { className: "text-sm text-green-300 mb-4", children: ["Carta ganadora #", winningCard.cardNumber] }), _jsx(BingoCard, { card: winningCard, songs: songs, isWinner: true })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3 justify-center flex-wrap", children: [_jsxs("button", { onClick: handlePlayNext, className: "btn-primary flex items-center gap-2 px-6 text-lg", children: [isPlaying ? _jsx(Pause, { className: "w-5 h-5" }) : _jsx(Play, { className: "w-5 h-5" }), isPlaying ? 'Pausar' : 'Siguiente'] }), _jsxs("button", { onClick: handleReset, className: "btn-secondary flex items-center gap-2 px-6", children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Reiniciar"] })] }), _jsxs("div", { className: "border-t border-gray-700 pt-6", children: [_jsxs("label", { className: "flex items-center gap-3 mb-4", children: [_jsx("input", { type: "checkbox", checked: autoPlay, onChange: (e) => setAutoPlay(e.target.checked), className: "w-4 h-4 cursor-pointer" }), _jsx("span", { className: "text-sm font-semibold", children: "Reproducci\u00F3n autom\u00E1tica" })] }), autoPlay && (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold mb-2", children: ["Intervalo entre canciones: ", _jsxs("span", { className: "text-primary", children: [interval, "s"] })] }), _jsx("input", { type: "range", min: "1", max: "30", value: interval, onChange: (e) => setInterval(Number(e.target.value)), className: "w-full h-2 bg-gray-700 rounded-lg" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-400 mt-2", children: [_jsx("span", { children: "1s" }), _jsx("span", { children: "30s" })] })] }))] })] })] }), _jsxs("div", { className: "space-y-6", children: [playedCount > 0 && (_jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Canciones Reproducidas" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto", children: songs
                                    .filter((song) => playedSongs.has(song.id))
                                    .map((song) => (_jsxs("div", { className: "p-2 rounded text-sm bg-green-900/30 text-green-200", children: [_jsx("span", { className: "mr-2", children: "\u2713" }), song.title] }, song.id))) })] })), _jsxs("div", { className: "card", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Canciones Pendientes" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto", children: songs
                                    .filter((song) => !playedSongs.has(song.id))
                                    .map((song) => (_jsx("div", { className: "p-2 rounded text-sm bg-gray-700 text-gray-300", children: song.title }, song.id))) })] })] })] }));
}
