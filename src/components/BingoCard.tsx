import type { BingoCard as BingoCardType, Song } from '@/types'
import type { SVGProps } from 'react'

interface Props {
  card: BingoCardType
  songs: Song[]
  playedSongs?: Set<string>
  isWinner?: boolean
}

function WeddingRingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="12" r="4" />
      <circle cx="14" cy="12" r="4" />
      <path d="M10.5 8.5l3 0" />
    </svg>
  )
}

export default function BingoCard({ card, songs, playedSongs = new Set(), isWinner = false }: Props) {
  const playedTitles = new Set(
    songs
      .filter((song) => playedSongs.has(song.id))
      .map((song) => song.title),
  )

  return (
    <div
      id={`bingo-card-${card.id}`}
      data-export-card-id={card.id}
      className={`bingo-card ${isWinner ? 'ring-4 ring-black bg-slate-100' : ''}`}
    >
      <div className="flex flex-col gap-4 mb-4 px-2">
        <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-3">
          <div>
            <h3 className="text-xl font-bold text-black">Carta #{card.cardNumber}</h3>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
              Bingo Musical
            </p>
          </div>
          <div className="rounded-full border-2 border-black bg-slate-100 p-3">
            <WeddingRingsIcon className="w-6 h-6 text-black" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-0 border-4 border-black rounded-xl overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => {
          const isFree = index === card.freePosition
          const songIndex = index < card.freePosition
            ? index
            : index - 1

          return (
            <div
              key={index}
              className={`bingo-cell ${isFree ? 'bingo-cell.free' : ''} aspect-square`}
            >
              {isFree ? (
                <div className="flex flex-col items-center justify-center h-full gap-1 px-2">
                  <WeddingRingsIcon className="w-6 h-6 text-black" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black">
                    Libre
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full px-2 py-2">
                  <span
                    className={`text-[11px] font-semibold text-black leading-tight text-center ${
                      playedTitles.has(card.songs[songIndex])
                        ? 'bg-slate-300 text-black rounded-lg border border-black px-2 py-1'
                        : ''
                    }`}
                  >
                    {card.songs[songIndex] || ''}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 rounded-3xl border-2 border-dashed border-black bg-slate-100 px-4 py-4 text-center">
        <p className="text-sm font-semibold text-black leading-relaxed">
          ¡Gracias por acompañarnos en este día tan especial!
        </p>
      </div>
    </div>
  )
}
