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
      className={`bingo-card ${isWinner ? 'ring-4 ring-green-400 bg-green-50' : ''}`}
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-black">Carta #{card.cardNumber}</h3>
      </div>

      <div className="grid grid-cols-4 gap-0 border-4 border-black">
        {Array.from({ length: 8 }).map((_, index) => {
          const isFree = index === card.freePosition
          const songIndex = index < card.freePosition
            ? index
            : index - 1

          return (
            <div
              key={index}
              className={`bingo-cell ${isFree ? 'bingo-cell.free' : ''} aspect-square`}
              style={{
                backgroundColor: isFree ? '#f3e8ff' : 'white',
                borderColor: 'black',
                borderWidth: '2px',
              }}
            >
              {isFree ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <WeddingRingsIcon className="w-6 h-6 text-purple-600 mb-1" />
                  <span className="text-xs font-bold text-black">J&A</span>
                </div>
              ) : (
                <span
                  className={`text-xs font-semibold text-black leading-tight px-1 py-2 line-clamp-4 ${
                    playedTitles.has(card.songs[songIndex])
                      ? 'bg-green-100 text-green-800 rounded-md'
                      : ''
                  }`}
                >
                  {card.songs[songIndex] || ''}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-purple-700">
          Gracias por acompañarnos en este día tan especial.
        </p>
      </div>
    </div>
  )
}
