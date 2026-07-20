import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { BingoCard, Song } from '@/types'

export async function exportToPDF(
  cards: BingoCard[],
  songs: Song[],
  playedSongs: Set<string>,
): Promise<void> {
  if (cards.length === 0) {
    alert('No hay cartas para exportar')
    return
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const hiddenRoot = document.createElement('div')
  hiddenRoot.style.position = 'fixed'
  hiddenRoot.style.left = '-9999px'
  hiddenRoot.style.top = '0'
  hiddenRoot.style.width = '1200px'
  hiddenRoot.style.height = 'auto'
  hiddenRoot.style.overflow = 'hidden'
  hiddenRoot.style.pointerEvents = 'none'
  hiddenRoot.style.opacity = '0'
  hiddenRoot.style.display = 'grid'
  hiddenRoot.style.gridTemplateColumns = '1fr'
  hiddenRoot.style.gap = '20px'
  document.body.appendChild(hiddenRoot)

  const cardElements = cards.map((card) => {
    const existingCard = document.querySelector<HTMLElement>(`[data-export-card-id="${card.id}"]`)
    const element = existingCard
      ? cloneCardElement(existingCard)
      : createCardExportElement(card, songs, playedSongs)

    hiddenRoot.appendChild(element)
    return element
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 10
  const printableWidth = pageWidth - margin * 2

  for (let i = 0; i < cardElements.length; i++) {
    const cardElement = cardElements[i]
    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = printableWidth
    const imgHeight = (canvas.height / canvas.width) * imgWidth

    if (i > 0) {
      pdf.addPage()
    }

    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
  }

  document.body.removeChild(hiddenRoot)
  pdf.save('bingo-cartas.pdf')
}

function cloneCardElement(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.display = 'block'
  clone.style.width = '820px'
  clone.style.margin = '0'
  clone.style.padding = '20px'
  clone.style.backgroundColor = '#ffffff'
  clone.style.boxSizing = 'border-box'
  clone.style.position = 'relative'
  return clone
}

function createCardExportElement(
  card: BingoCard,
  songs: Song[],
  playedSongs: Set<string>,
): HTMLElement {
  const playedTitles = new Set(
    songs
      .filter((song) => playedSongs.has(song.id))
      .map((song) => song.title),
  )

  const wrapper = document.createElement('div')
  wrapper.style.width = '820px'
  wrapper.style.padding = '20px'
  wrapper.style.backgroundColor = '#ffffff'
  wrapper.style.boxSizing = 'border-box'

  const cellsHtml = Array.from({ length: 8 })
    .map((_, cellIndex) => {
      const isFree = cellIndex === card.freePosition
      const songIndex = cellIndex < card.freePosition ? cellIndex : cellIndex - 1
      const song = isFree ? '' : card.songs[songIndex] || ''
      const isMarked = !isFree && playedTitles.has(song)

      return `
        <div class="bingo-cell ${isFree ? 'bingo-cell.free' : ''} aspect-square" style="background-color: ${isFree ? '#f3e8ff' : 'white'}; border-color: black; border-width: 2px; display: flex; align-items: center; justify-content: center;">
          ${isFree ? `
            <div class="flex flex-col items-center justify-center h-full">
              <span class="text-xs font-bold text-black">J&A</span>
            </div>
          ` : `
            <span class="text-xs font-semibold text-black leading-tight px-1 py-2 line-clamp-4 ${
              isMarked ? 'bg-green-100 text-green-800 rounded-md' : ''
            }">
              ${song}
            </span>
          `}
        </div>
      `
    })
    .join('')

  wrapper.innerHTML = `
    <div class="text-center mb-4">
      <h3 class="text-xl font-bold text-black">Carta #${card.cardNumber}</h3>
    </div>
    <div class="grid grid-cols-4 gap-0 border-4 border-black">
      ${cellsHtml}
    </div>
    <div class="mt-4 text-center">
      <p class="text-xs text-gray-600">Fecha: ${new Date(card.createdAt).toLocaleDateString()}</p>
    </div>
  `

  return wrapper
}

export async function exportCardToPNG(
  card: BingoCard,
  songs: Song[],
  playedSongs: Set<string>,
): Promise<void> {
  let targetElement = document.querySelector<HTMLElement>(`[data-export-card-id="${card.id}"]`)
  let cleanup = false

  if (!targetElement) {
    targetElement = createCardExportElement(card, songs, playedSongs)
    targetElement.style.position = 'absolute'
    targetElement.style.left = '-9999px'
    targetElement.style.top = '0'
    document.body.appendChild(targetElement)
    cleanup = true
  }

  try {
    const canvas = await html2canvas(targetElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `bingo-carta-${card.cardNumber}.png`
    link.click()
  } finally {
    if (cleanup && targetElement?.parentElement) {
      targetElement.parentElement.removeChild(targetElement)
    }
  }
}

export function printCards(): void {
  window.print()
}
