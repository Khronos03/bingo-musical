import { jsx as _jsx } from "react/jsx-runtime";
import { useBingoStore } from '@/store/bingoStore';
import { Sun, Moon } from 'lucide-react';
export default function ThemeToggle() {
    const { isDarkMode, toggleDarkMode } = useBingoStore();
    return (_jsx("button", { onClick: toggleDarkMode, className: "p-2 rounded-lg hover:bg-white/20 transition-colors", title: isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro', children: isDarkMode ? _jsx(Sun, { className: "w-6 h-6" }) : _jsx(Moon, { className: "w-6 h-6" }) }));
}
