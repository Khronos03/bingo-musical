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
  hiddenRoot.style.width = '720px'
  hiddenRoot.style.height = 'auto'
  hiddenRoot.style.overflow = 'hidden'
  hiddenRoot.style.pointerEvents = 'none'
  hiddenRoot.style.opacity = '0'
  hiddenRoot.style.backgroundColor = '#ffffff'
  document.body.appendChild(hiddenRoot)

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  const printableWidth = pageWidth - margin * 2
  const cardsPerPage = 3
  const spacing = 10
  const maxSlotHeight = (pageHeight - margin * 2 - spacing * (cardsPerPage - 1)) / cardsPerPage

  const images: string[] = []
  for (let i = 0; i < cards.length; i++) {
    const cardElement = createCardExportElement(cards[i], songs, playedSongs)
    hiddenRoot.appendChild(cardElement)

    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#ffffff',
      scale: 3,
      useCORS: true,
      logging: false,
    })

    hiddenRoot.removeChild(cardElement)
    images.push(canvas.toDataURL('image/png'))
  }

  for (let i = 0; i < images.length; i += cardsPerPage) {
    if (i > 0) {
      pdf.addPage()
    }

    for (let cardIndex = 0; cardIndex < cardsPerPage; cardIndex++) {
      const index = i + cardIndex
      if (index >= images.length) {
        break
      }

      const imgData = images[index]
      const img = new Image()
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image for PDF export'))
      })
      img.src = imgData
      await loaded

      let imgWidth = printableWidth
      let imgHeight = (img.height / img.width) * imgWidth
      if (imgHeight > maxSlotHeight) {
        imgHeight = maxSlotHeight
        imgWidth = (img.width / img.height) * imgHeight
      }

      const x = margin + (printableWidth - imgWidth) / 2
      const y = margin + cardIndex * (maxSlotHeight + spacing) + (maxSlotHeight - imgHeight) / 2
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight)
    }
  }

  document.body.removeChild(hiddenRoot)
  pdf.save('bingo-cartas.pdf')
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
  wrapper.style.width = '720px'
  wrapper.style.maxWidth = '720px'
  wrapper.style.padding = '20px'
  wrapper.style.backgroundColor = '#ffffff'
  wrapper.style.boxSizing = 'border-box'
  wrapper.style.border = '4px solid #000000'
  wrapper.style.borderRadius = '24px'
  wrapper.style.boxShadow = 'none'

  const ringIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" style="color: #000000; margin-bottom: 6px;">
      <circle cx="8" cy="12" r="4" />
      <circle cx="14" cy="12" r="4" />
      <path d="M10.5 8.5l3 0" />
    </svg>
  `

  const cellsHtml = Array.from({ length: 8 })
    .map((_, cellIndex) => {
      const isFree = cellIndex === card.freePosition
      const songIndex = cellIndex < card.freePosition ? cellIndex : cellIndex - 1
      const song = isFree ? '' : card.songs[songIndex] || ''
      const isMarked = !isFree && playedTitles.has(song)

      return `
        <div class="bingo-cell ${isFree ? 'bingo-cell.free' : ''} aspect-square" style="background-color: ${isFree ? '#e5e7eb' : 'white'}; border-color: black; border-width: 2px; display: flex; align-items: center; justify-content: center;">
          ${isFree ? `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 6px; padding: 8px;">
              ${ringIcon}
              <span style="font-size: 10px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.12em;">Libre</span>
            </div>
          ` : `
            <span style="font-size: 12px; font-weight: 600; color: #000000; line-height: 1.2; padding: 8px; display: block; text-align: center; ${
              isMarked ? 'background-color: #d1d5db; color: #000000; border-radius: 10px; border: 1px solid #000000;' : ''
            }">
              ${song}
            </span>
          `}
        </div>
      `
    })
    .join('')

  wrapper.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="font-size: 20px; font-weight: 700; color: #000000; margin: 0;">Carta #${card.cardNumber}</h3>
      <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; margin: 6px 0 0; color: #1f2937;">Bingo Musical</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 4px solid #000000; border-radius: 20px; overflow: hidden;">
      ${cellsHtml}
    </div>
    <div style="margin-top: 16px; text-align: center; padding: 16px; border: 2px dashed #000000; border-radius: 18px; background-color: #e5e7eb;">
      <p style="font-size: 13px; font-weight: 600; color: #000000; margin: 0;">¡Gracias por acompañarnos en este día tan especial!</p>
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
