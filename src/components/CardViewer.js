import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { useBingoStore } from '@/store/bingoStore';
import { Download, Printer, Image as ImageIcon, AlertCircle } from 'lucide-react';
import BingoCard from '@/components/BingoCard';
export default function CardViewer() {
    const [isExporting, setIsExporting] = useState(false);
    const [sortBy, setSortBy] = useState('number');
    const { cards, songs, playedSongs, exportCardsToPDF, exportCardToPNG } = useBingoStore();
    const sortedCards = useMemo(() => {
        const playedTitles = new Set(songs
            .filter((song) => playedSongs.has(song.id))
            .map((song) => song.title));
        return cards
            .map((card) => ({
            card,
            matches: card.songs.filter((title) => playedTitles.has(title)).length,
        }))
            .sort((a, b) => {
            if (sortBy === 'proximity') {
                return b.matches - a.matches || a.card.cardNumber - b.card.cardNumber;
            }
            return a.card.cardNumber - b.card.cardNumber;
        });
    }, [cards, playedSongs, songs, sortBy]);
    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportCardsToPDF();
        }
        finally {
            setIsExporting(false);
        }
    };
    const handleExportCardPNG = async (cardId) => {
        setIsExporting(true);
        try {
            await exportCardToPNG(cardId);
        }
        finally {
            setIsExporting(false);
        }
    };
    const handlePrint = () => {
        window.print();
    };
    if (cards.length === 0) {
        return (_jsxs("div", { className: "card text-center py-12", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-gray-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-400 text-lg mb-2", children: "No hay cartas generadas" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Ve a la secci\u00F3n \"Generar Cartas\" para crear cartas de bingo" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "card flex justify-between items-center", children: [_jsxs("h2", { className: "text-2xl font-bold", children: ["Cartas Generadas (", cards.length, ")"] }), _jsxs("div", { className: "flex gap-2 flex-wrap justify-end", children: [_jsxs("button", { onClick: handlePrint, className: "btn-secondary flex items-center gap-2", children: [_jsx(Printer, { className: "w-4 h-4" }), "Imprimir"] }), _jsxs("button", { onClick: handleExportPDF, disabled: isExporting, className: "btn-primary flex items-center gap-2 disabled:opacity-50", children: [_jsx(Download, { className: "w-4 h-4" }), isExporting ? 'Exportando...' : 'Exportar PDF'] })] })] }), _jsx("div", { className: "card p-4", children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", htmlFor: "sort-cards", children: "Ordenar por:" }), _jsxs("select", { id: "sort-cards", value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full sm:w-auto rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white", children: [_jsx("option", { value: "number", children: "N\u00FAmero de carta" }), _jsx("option", { value: "proximity", children: "M\u00E1s cerca de ganar" })] })] }), _jsx("p", { className: "text-sm text-gray-400 max-w-xl", children: "Las cartas se ordenan en vivo seg\u00FAn cu\u00E1ntas canciones ya tienen marcadas." })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print", children: sortedCards.map(({ card, matches }) => (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("span", { className: "text-sm font-semibold text-gray-200", children: ["Carta #", card.cardNumber] }), _jsxs("span", { className: "rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200", children: [matches, "/7 marcadas"] })] }), _jsx(BingoCard, { card: card, songs: songs, playedSongs: playedSongs }), _jsxs("button", { onClick: () => handleExportCardPNG(card.id), disabled: isExporting, className: "w-full btn-ghost flex items-center justify-center gap-2 text-sm disabled:opacity-50", children: [_jsx(ImageIcon, { className: "w-4 h-4" }), "Exportar PNG"] })] }, card.id))) }), _jsx("div", { className: "print-cards hidden print:block", children: cards.map((card) => (_jsx("div", { className: "break-inside-avoid mb-8 page-break", children: _jsx(BingoCard, { card: card, songs: songs, playedSongs: playedSongs }) }, card.id))) })] }));
}
