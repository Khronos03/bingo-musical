import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function WeddingRingsIcon(props) {
    return (_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("circle", { cx: "8", cy: "12", r: "4" }), _jsx("circle", { cx: "14", cy: "12", r: "4" }), _jsx("path", { d: "M10.5 8.5l3 0" })] }));
}
export default function BingoCard({ card, songs, playedSongs = new Set(), isWinner = false }) {
    const playedTitles = new Set(songs
        .filter((song) => playedSongs.has(song.id))
        .map((song) => song.title));
    return (_jsxs("div", { id: `bingo-card-${card.id}`, "data-export-card-id": card.id, className: `bingo-card ${isWinner ? 'ring-4 ring-black bg-slate-100' : ''}`, children: [_jsxs("div", { className: "flex flex-col gap-4 mb-4 px-2", children: [_jsxs("div", { className: "flex items-center justify-between gap-4 border-b-2 border-black pb-3", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-black", children: ["Carta #", card.cardNumber] }), _jsx("p", { className: "text-[11px] uppercase tracking-[0.18em] text-slate-600", children: "Bingo Musical" })] }), _jsx("div", { className: "rounded-full border-2 border-black bg-slate-100 p-3", children: _jsx(WeddingRingsIcon, { className: "w-6 h-6 text-black" }) })] }), _jsx("div", { className: "grid grid-cols-4 gap-0 border-4 border-black rounded-xl overflow-hidden", children: Array.from({ length: 8 }).map((_, index) => {
                            const isFree = index === card.freePosition;
                            const songIndex = index < card.freePosition
                                ? index
                                : index - 1;
                            return (_jsx("div", { className: `bingo-cell ${isFree ? 'bingo-cell.free' : ''} aspect-square`, children: isFree ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-1 px-2", children: [_jsx(WeddingRingsIcon, { className: "w-6 h-6 text-black" }), _jsx("span", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-black", children: "Libre" })] })) : (_jsx("div", { className: "flex items-center justify-center h-full px-2 py-2", children: _jsx("span", { className: `text-[11px] font-semibold text-black leading-tight text-center ${playedTitles.has(card.songs[songIndex])
                                            ? 'bg-slate-300 text-black rounded-lg border border-black px-2 py-1'
                                            : ''}`, children: card.songs[songIndex] || '' }) })) }, index));
                        }) }), _jsx("div", { className: "mt-5 rounded-3xl border-2 border-dashed border-black bg-slate-100 px-4 py-4 text-center", children: _jsx("p", { className: "text-sm font-semibold text-black leading-relaxed", children: "\u00A1Gracias por acompa\u00F1arnos en este d\u00EDa tan especial!" }) })] }), ") }"] }));
}
