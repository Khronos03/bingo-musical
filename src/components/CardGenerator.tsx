import { useState } from 'react'
import { useBingoStore } from '@/store/bingoStore'
import { Zap, AlertCircle } from 'lucide-react'

export default function CardGenerator() {
  const [cardCount, setCardCount] = useState(10)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const { songs, cards, generateCards, clearCards } = useBingoStore()

  const handleGenerateCards = async () => {
    if (songs.length < 7) {
      setError('Se necesitan al menos 7 canciones para generar cartas')
      return
    }

    if (cardCount < 1) {
      setError('Debes generar al menos 1 carta')
      return
    }

    setError('')
    setSuccessMessage('')
    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 30, 90))
    }, 100)

    try {
      const success = await generateCards(cardCount)
      clearInterval(interval)
      setProgress(100)

      if (success) {
        setSuccessMessage(`✓ ${cardCount} cartas generadas exitosamente`)
        setCardCount(10)
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setError('No fue posible generar las cartas. Verifica la cantidad de canciones.')
      }
    } catch (err) {
      clearInterval(interval)
      setError(err instanceof Error ? err.message : 'Error al generar cartas')
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">Generar Cartas de Bingo</h2>
        <p className="text-gray-400 mb-6">
          Canciones disponibles: <span className="font-semibold text-white">{songs.length}</span>
        </p>

        {songs.length < 7 && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              Necesitas al menos 7 canciones para generar cartas. Actualmente tienes {songs.length}.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Cantidad de cartas a generar: <span className="text-primary">{cardCount}</span>
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              disabled={isGenerating || songs.length < 7}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1</span>
              <span>1000</span>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={cardCount}
              onChange={(e) => setCardCount(Math.max(1, Number(e.target.value)))}
              disabled={isGenerating || songs.length < 7}
              className="input-field w-24"
            />
            <button
              onClick={handleGenerateCards}
              disabled={isGenerating || songs.length < 7}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isGenerating ? 'Generando...' : 'Generar Cartas'}
            </button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-gray-400 text-center">{Math.round(progress)}%</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 flex gap-3">
              <div className="w-5 h-5 text-green-400 flex-shrink-0 flex items-center justify-center">✓</div>
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          )}
        </div>
      </div>

      {cards.length > 0 && (
        <div className="card bg-blue-900/20 border-blue-700">
          <p className="text-blue-200 text-sm">
            Total de cartas generadas: <span className="font-bold text-white">{cards.length}</span>
          </p>
          <button
            onClick={clearCards}
            className="mt-4 w-full btn-ghost text-red-400 hover:text-red-300"
          >
            Borrar todas las cartas
          </button>
        </div>
      )}
    </div>
  )
}
