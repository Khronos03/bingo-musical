import { useState, useEffect } from 'react'
import { useBingoStore } from '@/store/bingoStore'
import BingoCard from '@/components/BingoCard'
import {
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'

export default function PlaybackMode() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [interval, setInterval] = useState(3)

  const {
    songs,
    cards,
    currentSongIndex,
    playedSongs,
    winningCardId,
    playNextSong,
    resetPlayback,
  } = useBingoStore()

  useEffect(() => {
    if (autoPlay && isPlaying && songs.length > 0) {
      const timer = setTimeout(() => {
        playNextSong()
      }, interval * 1000)

      return () => clearTimeout(timer)
    }
  }, [isPlaying, autoPlay, interval, songs.length, currentSongIndex, playNextSong])

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null
  const playedCount = playedSongs.size
  const remainingCount = songs.length - playedCount
  const isFinished = playedCount === songs.length && songs.length > 0
  const winningCard = cards.find((card) => card.id === winningCardId)

  const handlePlayNext = () => {
    if (songs.length > 0) {
      playNextSong()
      setIsPlaying(true)
    }
  }

  const handleReset = () => {
    resetPlayback()
    setIsPlaying(false)
  }

  if (songs.length === 0) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">No hay canciones agregadas</p>
        <p className="text-gray-500 text-sm">
          Agrega canciones en la sección "Canciones" para poder usar el modo reproducción
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">Modo Reproducción</h2>
        <p className="text-gray-400 mb-6">
          Canciones disponibles: {songs.length}
        </p>

        {isFinished && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-center font-semibold">
              ✓ Se han reproducido todas las canciones
            </p>
          </div>
        )}

        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/50 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-400 text-sm mb-2">Canción Actual</p>
          <h3 className="text-4xl font-bold text-white mb-4 min-h-16 flex items-center justify-center">
            {currentSong ? currentSong.title : 'Presiona play'}
          </h3>

          <div className="flex gap-4 justify-center flex-wrap">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Reproducidas</p>
              <p className="text-3xl font-bold text-primary">{playedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Restantes</p>
              <p className="text-3xl font-bold text-secondary">{remainingCount}</p>
            </div>
          </div>
        </div>

        {winningCard && (
          <div className="card border border-green-500 bg-green-950/10 p-6 mb-6">
            <h3 className="text-xl font-bold text-green-200 mb-2">¡Tenemos Ganador!</h3>
            <p className="text-sm text-green-300 mb-4">
              Carta ganadora #{winningCard.cardNumber}
            </p>
            <BingoCard card={winningCard} songs={songs} isWinner />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handlePlayNext}
              className="btn-primary flex items-center gap-2 px-6 text-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pausar' : 'Siguiente'}
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2 px-6"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-semibold">Reproducción automática</span>
            </label>

            {autoPlay && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Intervalo entre canciones: <span className="text-primary">{interval}s</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>1s</span>
                  <span>30s</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {playedCount > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Canciones Reproducidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {songs
                .filter((song) => playedSongs.has(song.id))
                .map((song) => (
                  <div
                    key={song.id}
                    className="p-2 rounded text-sm bg-green-900/30 text-green-200"
                  >
                    <span className="mr-2">✓</span>
                    {song.title}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-bold mb-4">Canciones Pendientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {songs
              .filter((song) => !playedSongs.has(song.id))
              .map((song) => (
                <div
                  key={song.id}
                  className="p-2 rounded text-sm bg-gray-700 text-gray-300"
                >
                  {song.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
