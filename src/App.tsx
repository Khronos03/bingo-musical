import { useEffect, useState } from 'react'
import { useBingoStore } from '@/store/bingoStore'
import SongManager from '@/components/SongManager'
import CardGenerator from '@/components/CardGenerator'
import CardViewer from '@/components/CardViewer'
import PlaybackMode from '@/components/PlaybackMode'
import ThemeToggle from '@/components/ThemeToggle'
import { Music } from 'lucide-react'

type Tab = 'songs' | 'generate' | 'view' | 'playback'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('songs')
  const { isDarkMode } = useBingoStore()

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gradient-to-r from-primary to-secondary shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Bingo Musical</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto">
            <NavButton
              label="Canciones"
              tab="songs"
              active={activeTab}
              onClick={() => setActiveTab('songs')}
            />
            <NavButton
              label="Generar Cartas"
              tab="generate"
              active={activeTab}
              onClick={() => setActiveTab('generate')}
            />
            <NavButton
              label="Ver Cartas"
              tab="view"
              active={activeTab}
              onClick={() => setActiveTab('view')}
            />
            <NavButton
              label="Modo Reproducción"
              tab="playback"
              active={activeTab}
              onClick={() => setActiveTab('playback')}
            />
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'songs' && <SongManager />}
          {activeTab === 'generate' && <CardGenerator />}
          {activeTab === 'view' && <CardViewer />}
          {activeTab === 'playback' && <PlaybackMode />}
        </main>

        <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-4 text-center text-gray-400 text-sm">
          <p>Bingo Musical © 2024 - Generador de Cartas y Reproductor Aleatorio</p>
        </footer>
      </div>
    </div>
  )
}

interface NavButtonProps {
  label: string
  tab: Tab
  active: Tab
  onClick: () => void
}

function NavButton({ label, tab, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 whitespace-nowrap border-b-2 font-semibold transition-colors ${
        active === tab
          ? 'border-white text-white'
          : 'border-transparent text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}
