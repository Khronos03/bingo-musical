# Bingo Musical

Una aplicación web moderna y completamente funcional para generar cartas de bingo musical con reproducción aleatoria.

## Características

✨ **Administración de Canciones**
- Agregar, editar y eliminar canciones
- Importar listas de canciones mediante texto
- Almacenamiento persistente en LocalStorage

🎲 **Generación Inteligente de Cartas**
- Generar cientos o miles de cartas únicas garantizadas
- Algoritmo eficiente que evita duplicados
- Posición aleatoria del ícono "LIBRE" en cada carta
- Cuadrícula de 2×4 (8 celdas) con 7 canciones + 1 celda libre
- Indicador de límite máximo de combinaciones posibles

📋 **Visualización y Exportación**
- Ver cartas en cuadrícula responsiva
- Exportar todas las cartas a PDF
- Exportar individual a PNG
- Imprimir directamente desde el navegador
- Diseño optimizado para impresión

🎵 **Modo de Reproducción**
- Reproductor aleatorio de canciones
- Evita repetir canciones
- Modo de reproducción automática configurable
- Visualización de canciones reproducidas
- Contador de canciones restantes

🌙 **Interfaz Moderna**
- Modo claro y oscuro
- Diseño totalmente responsivo
- Componentes modernos con Lucide Icons
- Estilos con TailwindCSS
- Animaciones suaves

💾 **Persistencia de Datos**
- Auto-guardado en LocalStorage
- Recuperación automática de datos al abrir
- Sincronización instantánea

## Stack Tecnológico

- **React 18** - Biblioteca UI moderna
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Zustand** - Gestión de estado global
- **TailwindCSS** - Estilos utilities-first
- **jsPDF** - Exportación a PDF
- **html2canvas** - Captura de elementos a imágenes
- **Lucide React** - Iconografía moderna

## Instalación

```bash
# Clonar o descargar el proyecto
cd bingo-musical

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## Uso

### 1. Agregar Canciones
- Ve a la pestaña "Canciones"
- Ingresa títulos individuales o importa una lista mediante texto
- Las canciones se guardan automáticamente

### 2. Generar Cartas
- Ve a "Generar Cartas"
- Ajusta la cantidad (1-1000)
- Presiona "Generar Cartas"
- Espera a que se complete la generación

### 3. Visualizar y Exportar
- Ve a "Ver Cartas"
- Navega entre páginas de cartas
- Exporta a PDF, PNG o imprime directamente

### 4. Modo Reproducción
- Ve a "Modo Reproducción"
- Presiona "Siguiente" para reproducir canciones aleatorias
- Activa "Reproducción automática" para avance automático
- Reinicia cuando sea necesario

## Algoritmo de Generación

El algoritmo utiliza un sistema de firmas única para garantizar que:
- No existan cartas duplicadas
- La combinación de canciones + posición del ícono sea única
- Se maximice la diversidad entre cartas
- Se calcule correctamente el máximo de combinaciones posibles

Fórmula: `C(n,7) × 8` donde n es el número de canciones

## Estructura del Proyecto

```
src/
├── components/        # Componentes React
│   ├── SongManager.tsx
│   ├── CardGenerator.tsx
│   ├── CardViewer.tsx
│   ├── PlaybackMode.tsx
│   ├── BingoCard.tsx
│   └── ThemeToggle.tsx
├── store/            # Zustand state management
│   └── bingoStore.ts
├── utils/            # Funciones utilidad
│   ├── cardGenerator.ts
│   └── exportUtils.ts
├── types/            # Definiciones TypeScript
│   └── index.ts
├── App.tsx           # Componente principal
├── main.tsx          # Punto de entrada
└── index.css         # Estilos globales
```

## Requisitos del Sistema

- Node.js 16+
- npm 8+

## Funcionalidades Técnicas

### Generación de Cartas
- Algoritmo de combinatoria eficiente
- Uso de `Set` para evitar duplicados
- Hashing de firmas de cartas
- Manejo de errores para límites de combinaciones

### Exportación
- PDF con librería jsPDF
- PNG con html2canvas
- Impresión HTML5 nativa

### Almacenamiento
- LocalStorage para persistencia
- Hidratación automática del store
- Sincronización en tiempo real

### Rendimiento
- Componentes funcionales con Hooks
- Memoización automática con Zustand
- CSS modules compilados a runtime
- Vite para compilación optimizada

## Tipado TypeScript

El proyecto incluye tipado completo:
- Interfaces para Song, BingoCard, BingoState
- Type-safe en componentes y funciones
- Autocompletado en el editor

## Modo Oscuro

- Activación mediante botón en header
- Persistencia de preferencia
- Sincronización con TailwindCSS dark mode
- Estilos optimizados para ambos modos

## Limitaciones y Restricciones

- Máximo de canciones: Sin límite teórico
- Máximo de cartas: Limitado por combinaciones posibles
- Mínimo de canciones: 7
- Grid fijo: 2 filas × 4 columnas (8 celdas)

## Licencia

MIT - Libre para uso personal y comercial

## Autor

Desarrollado como aplicación de Bingo Musical completamente funcional y lista para producción.

---

**Bingo Musical v1.0.0** - 2024
