# Bingo Musical - Copilot Instructions

This is a professional React + TypeScript full-stack web application for generating unique musical bingo cards with random playback functionality.

## Project Overview

**Bingo Musical** is a complete, production-ready web application that allows users to:
- Manage a custom song library
- Generate thousands of unique bingo cards
- View, export, and print cards
- Play songs in random order with automatic playback

## Technical Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.1.6
- **State Management**: Zustand 4.5.5
- **Styling**: TailwindCSS 3.4.3
- **Export**: jsPDF 2.5.1, html2canvas 1.4.1
- **Icons**: Lucide React 0.408.0

## Project Structure

```
src/
├── components/          # React components
├── store/              # Zustand state management
├── utils/              # Utility functions
├── types/              # TypeScript interfaces
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Features

1. **Song Management** - Add, edit, delete, and bulk import songs
2. **Smart Card Generation** - Generates unique bingo cards with guaranteed no duplicates
3. **Export & Print** - PDF export, PNG export, and browser printing
4. **Music Playback** - Random song playback with no repeats
5. **Dark/Light Theme** - User preference toggle
6. **LocalStorage Persistence** - Automatic data saving and recovery
7. **Responsive Design** - Fully responsive across all devices

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Code Quality Standards

- Full TypeScript typing
- Component-based architecture
- Functional components with React Hooks
- Zustand for global state
- TailwindCSS for styling
- No prop drilling with context/store
- Modular utility functions
- Clean separation of concerns

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Efficient card generation algorithm using Sets
- Lazy rendering of card lists
- TailwindCSS for optimized CSS
- Vite for fast HMR development
- Production build optimization

## Data Persistence

All data is stored in LocalStorage:
- Songs list
- Generated cards
- User preferences (theme)
- State automatically hydrates on app load

## Algorithms

### Card Generation
- Uses combinatorial formula: C(n,7) × 8
- Guarantees unique cards via signature hashing
- Efficient even for 1000+ cards
- Detects and reports when limit is reached

### Random Playback
- Fisher-Yates shuffle implementation
- No song repeats until all songs played
- Auto-advance with configurable interval

## Deployment

The built app (npm run build) can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## Maintenance Notes

- Dependencies are up-to-date as of 2024
- All peer dependencies properly specified
- Build process is zero-config
- No breaking changes expected in near future
