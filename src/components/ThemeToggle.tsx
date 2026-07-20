import { useBingoStore } from '@/store/bingoStore'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useBingoStore()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  )
}
