import { useMemo, useState } from 'react'
import { useBingoStore } from '@/store/bingoStore'
import { Download, Printer, Image as ImageIcon, AlertCircle } from 'lucide-react'
import BingoCard from '@/components/BingoCard'

export default function CardViewer() {
  const [isExporting, setIsExporting] = useState(false)
  const [sortBy, setSortBy] = useState<'number' | 'proximity'>('number')
  const { cards, songs, playedSongs, exportCardsToPDF, exportCardToPNG } = useBingoStore()

  const sortedCards = useMemo(() => {
    const playedTitles = new Set(
      songs
        .filter((song) => playedSongs.has(song.id))
        .map((song) => song.title),
    )

    return cards
      .map((card) => ({
        card,
        matches: card.songs.filter((title) => playedTitles.has(title)).length,
      }))
      .sort((a, b) => {
        if (sortBy === 'proximity') {
          return b.matches - a.matches || a.card.cardNumber - b.card.cardNumber
        }

        return a.card.cardNumber - b.card.cardNumber
      })
  }, [cards, playedSongs, songs, sortBy])

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportCardsToPDF()
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCardPNG = async (cardId: string) => {
    setIsExporting(true)
    try {
      await exportCardToPNG(cardId)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (cards.length === 0) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">No hay cartas generadas</p>
        <p className="text-gray-500 text-sm">
          Ve a la sección "Generar Cartas" para crear cartas de bingo
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Cartas Generadas ({cards.length})
        </h2>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="sort-cards">
              Ordenar por:
            </label>
            <select
              id="sort-cards"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'number' | 'proximity')}
              className="w-full sm:w-auto rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white"
            >
              <option value="number">Número de carta</option>
              <option value="proximity">Más cerca de ganar</option>
            </select>
          </div>
          <p className="text-sm text-gray-400 max-w-xl">
            Las cartas se ordenan en vivo según cuántas canciones ya tienen marcadas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
        {sortedCards.map(({ card, matches }) => (
          <div key={card.id} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-gray-200">
                Carta #{card.cardNumber}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                {matches}/7 marcadas
              </span>
            </div>
            <BingoCard card={card} songs={songs} playedSongs={playedSongs} />
            <button
              onClick={() => handleExportCardPNG(card.id)}
              disabled={isExporting}
              className="w-full btn-ghost flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              Exportar PNG
            </button>
          </div>
        ))}
      </div>

      <div className="print-cards hidden print:block">
        {cards.map((card) => (
          <div
            key={card.id}
            className="break-inside-avoid mb-8 page-break"
          >
            <BingoCard card={card} songs={songs} playedSongs={playedSongs} />
          </div>
        ))}
      </div>
    </div>
  )
}
