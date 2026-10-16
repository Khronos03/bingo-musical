import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useBingoStore } from '@/store/bingoStore';
import { Zap, AlertCircle } from 'lucide-react';
export default function CardGenerator() {
    const [cardCount, setCardCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const { songs, cards, generateCards, clearCards } = useBingoStore();
    const handleGenerateCards = async () => {
        if (songs.length < 7) {
            setError('Se necesitan al menos 7 canciones para generar cartas');
            return;
        }
        if (cardCount < 1) {
            setError('Debes generar al menos 1 carta');
            return;
        }
        setError('');
        setSuccessMessage('');
        setIsGenerating(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((p) => Math.min(p + Math.random() * 30, 90));
        }, 100);
        try {
            const success = await generateCards(cardCount);
            clearInterval(interval);
            setProgress(100);
            if (success) {
                setSuccessMessage(`✓ ${cardCount} cartas generadas exitosamente`);
                setCardCount(10);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
            else {
                setError('No fue posible generar las cartas. Verifica la cantidad de canciones.');
            }
        }
        catch (err) {
            clearInterval(interval);
            setError(err instanceof Error ? err.message : 'Error al generar cartas');
        }
        finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Generar Cartas de Bingo" }), _jsxs("p", { className: "text-gray-400 mb-6", children: ["Canciones disponibles: ", _jsx("span", { className: "font-semibold text-white", children: songs.length })] }), songs.length < 7 && (_jsxs("div", { className: "bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-yellow-400 flex-shrink-0" }), _jsxs("p", { className: "text-yellow-200 text-sm", children: ["Necesitas al menos 7 canciones para generar cartas. Actualmente tienes ", songs.length, "."] })] })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold mb-2", children: ["Cantidad de cartas a generar: ", _jsx("span", { className: "text-primary", children: cardCount })] }), _jsx("input", { type: "range", min: "1", max: "1000", value: cardCount, onChange: (e) => setCardCount(Number(e.target.value)), disabled: isGenerating || songs.length < 7, className: "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-400 mt-2", children: [_jsx("span", { children: "1" }), _jsx("span", { children: "1000" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: cardCount, onChange: (e) => setCardCount(Math.max(1, Number(e.target.value))), disabled: isGenerating || songs.length < 7, className: "input-field w-24" }), _jsxs("button", { onClick: handleGenerateCards, disabled: isGenerating || songs.length < 7, className: "btn-primary flex-1 flex items-center justify-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4" }), isGenerating ? 'Generando...' : 'Generar Cartas'] })] }), isGenerating && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: `${progress}%` } }) }), _jsxs("p", { className: "text-sm text-gray-400 text-center", children: [Math.round(progress), "%"] })] })), error && (_jsxs("div", { className: "bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-400 flex-shrink-0" }), _jsx("p", { className: "text-red-200 text-sm", children: error })] })), successMessage && (_jsxs("div", { className: "bg-green-900/30 border border-green-700 rounded-lg p-4 flex gap-3", children: [_jsx("div", { className: "w-5 h-5 text-green-400 flex-shrink-0 flex items-center justify-center", children: "\u2713" }), _jsx("p", { className: "text-green-200 text-sm", children: successMessage })] }))] })] }), cards.length > 0 && (_jsxs("div", { className: "card bg-blue-900/20 border-blue-700", children: [_jsxs("p", { className: "text-blue-200 text-sm", children: ["Total de cartas generadas: ", _jsx("span", { className: "font-bold text-white", children: cards.length })] }), _jsx("button", { onClick: clearCards, className: "mt-4 w-full btn-ghost text-red-400 hover:text-red-300", children: "Borrar todas las cartas" })] }))] }));
}
