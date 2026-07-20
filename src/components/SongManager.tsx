import { useState } from 'react'
import { useBingoStore } from '@/store/bingoStore'
import { Trash2, Edit2, Plus, Upload } from 'lucide-react'

export default function SongManager() {
  const [newSong, setNewSong] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [importText, setImportText] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)

  const { songs, addSong, editSong, deleteSong, importSongs } = useBingoStore()

  const handleAddSong = () => {
    if (newSong.trim()) {
      addSong(newSong)
      setNewSong('')
    }
  }

  const handleEditSong = (id: string) => {
    if (editingTitle.trim()) {
      editSong(id, editingTitle)
      setEditingId(null)
      setEditingTitle('')
    }
  }

  const handleImportSongs = () => {
    const titles = importText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (titles.length > 0) {
      importSongs(titles)
      setImportText('')
      setShowImportModal(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Administración de Canciones</h2>
        <p className="text-gray-400 mb-6">
          Total: <span className="font-semibold text-white">{songs.length}</span> canciones
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSong()}
              placeholder="Ingresa el título de una canción..."
              className="input-field"
            />
            <button onClick={handleAddSong} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar Lista
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {songs.length === 0 ? (
          <div className="card text-center text-gray-400 py-8">
            <p>No hay canciones agregadas aún</p>
          </div>
        ) : (
          songs.map((song) => (
            <div
              key={song.id}
              className="card flex items-center justify-between hover:bg-gray-700 transition-colors group"
            >
              {editingId === song.id ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSong(song.id)}
                    className="btn-primary"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-ghost"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1">{song.title}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(song.id)
                        setEditingTitle(song.title)
                      }}
                      className="btn-ghost"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSong(song.id)}
                      className="btn-ghost text-red-400 hover:text-red-300"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {showImportModal && (
        <ImportModal
          text={importText}
          onChange={setImportText}
          onImport={handleImportSongs}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  )
}

interface ImportModalProps {
  text: string
  onChange: (text: string) => void
  onImport: () => void
  onClose: () => void
}

function ImportModal({ text, onChange, onImport, onClose }: ImportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Importar Lista de Canciones</h3>
        <p className="text-gray-400 mb-4">Ingresa una canción por línea:</p>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Canción 1&#10;Canción 2&#10;Canción 3..."
          className="input-field h-40 resize-none mb-4"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button onClick={onImport} className="btn-primary">
            Importar
          </button>
        </div>
      </div>
    </div>
  )
}
