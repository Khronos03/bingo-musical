import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useBingoStore } from '@/store/bingoStore';
import SongManager from '@/components/SongManager';
import CardGenerator from '@/components/CardGenerator';
import CardViewer from '@/components/CardViewer';
import PlaybackMode from '@/components/PlaybackMode';
import ThemeToggle from '@/components/ThemeToggle';
import { Music } from 'lucide-react';
export default function App() {
    const [activeTab, setActiveTab] = useState('songs');
    const { isDarkMode } = useBingoStore();
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        }
        else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);
    return (_jsx("div", { className: isDarkMode ? 'dark' : '', children: _jsxs("div", { className: "min-h-screen bg-gray-900 text-white", children: [_jsx("header", { className: "bg-gradient-to-r from-primary to-secondary shadow-lg", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Music, { className: "w-8 h-8" }), _jsx("h1", { className: "text-3xl font-bold", children: "Bingo Musical" })] }), _jsx(ThemeToggle, {})] }) }), _jsx("nav", { className: "bg-gray-800 border-b border-gray-700", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto", children: [_jsx(NavButton, { label: "Canciones", tab: "songs", active: activeTab, onClick: () => setActiveTab('songs') }), _jsx(NavButton, { label: "Generar Cartas", tab: "generate", active: activeTab, onClick: () => setActiveTab('generate') }), _jsx(NavButton, { label: "Ver Cartas", tab: "view", active: activeTab, onClick: () => setActiveTab('view') }), _jsx(NavButton, { label: "Modo Reproducci\u00F3n", tab: "playback", active: activeTab, onClick: () => setActiveTab('playback') })] }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [activeTab === 'songs' && _jsx(SongManager, {}), activeTab === 'generate' && _jsx(CardGenerator, {}), activeTab === 'view' && _jsx(CardViewer, {}), activeTab === 'playback' && _jsx(PlaybackMode, {})] }), _jsx("footer", { className: "bg-gray-800 border-t border-gray-700 mt-12 py-4 text-center text-gray-400 text-sm", children: _jsx("p", { children: "Bingo Musical \u00A9 2024 - Generador de Cartas y Reproductor Aleatorio" }) })] }) }));
}
function NavButton({ label, tab, active, onClick }) {
    return (_jsx("button", { onClick: onClick, className: `px-4 py-3 whitespace-nowrap border-b-2 font-semibold transition-colors ${active === tab
            ? 'border-white text-white'
            : 'border-transparent text-gray-400 hover:text-white'}`, children: label }));
}
