import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useBingoStore } from '@/store/bingoStore';
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';
export default function SongManager() {
    const [newSong, setNewSong] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [importText, setImportText] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const { songs, addSong, editSong, deleteSong, importSongs } = useBingoStore();
    const handleAddSong = () => {
        if (newSong.trim()) {
            addSong(newSong);
            setNewSong('');
        }
    };
    const handleEditSong = (id) => {
        if (editingTitle.trim()) {
            editSong(id, editingTitle);
            setEditingId(null);
            setEditingTitle('');
        }
    };
    const handleImportSongs = () => {
        const titles = importText
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        if (titles.length > 0) {
            importSongs(titles);
            setImportText('');
            setShowImportModal(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "card", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Administraci\u00F3n de Canciones" }), _jsxs("p", { className: "text-gray-400 mb-6", children: ["Total: ", _jsx("span", { className: "font-semibold text-white", children: songs.length }), " canciones"] }), _jsxs("div", { className: "space-y-3 mb-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newSong, onChange: (e) => setNewSong(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleAddSong(), placeholder: "Ingresa el t\u00EDtulo de una canci\u00F3n...", className: "input-field" }), _jsxs("button", { onClick: handleAddSong, className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), "Agregar"] })] }), _jsxs("button", { onClick: () => setShowImportModal(true), className: "btn-secondary w-full flex items-center justify-center gap-2", children: [_jsx(Upload, { className: "w-4 h-4" }), "Importar Lista"] })] })] }), _jsx("div", { className: "grid gap-3", children: songs.length === 0 ? (_jsx("div", { className: "card text-center text-gray-400 py-8", children: _jsx("p", { children: "No hay canciones agregadas a\u00FAn" }) })) : (songs.map((song) => (_jsx("div", { className: "card flex items-center justify-between hover:bg-gray-700 transition-colors group", children: editingId === song.id ? (_jsxs("div", { className: "flex gap-2 w-full", children: [_jsx("input", { type: "text", value: editingTitle, onChange: (e) => setEditingTitle(e.target.value), className: "input-field", autoFocus: true }), _jsx("button", { onClick: () => handleEditSong(song.id), className: "btn-primary", children: "Guardar" }), _jsx("button", { onClick: () => setEditingId(null), className: "btn-ghost", children: "Cancelar" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "flex-1", children: song.title }), _jsxs("div", { className: "flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => {
                                            setEditingId(song.id);
                                            setEditingTitle(song.title);
                                        }, className: "btn-ghost", title: "Editar", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => deleteSong(song.id), className: "btn-ghost text-red-400 hover:text-red-300", title: "Eliminar", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })) }, song.id)))) }), showImportModal && (_jsx(ImportModal, { text: importText, onChange: setImportText, onImport: handleImportSongs, onClose: () => setShowImportModal(false) }))] }));
}
function ImportModal({ text, onChange, onImport, onClose }) {
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsxs("div", { className: "card w-full max-w-lg", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "Importar Lista de Canciones" }), _jsx("p", { className: "text-gray-400 mb-4", children: "Ingresa una canci\u00F3n por l\u00EDnea:" }), _jsx("textarea", { value: text, onChange: (e) => onChange(e.target.value), placeholder: "Canci\u00F3n 1\nCanci\u00F3n 2\nCanci\u00F3n 3...", className: "input-field h-40 resize-none mb-4" }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: onClose, className: "btn-ghost", children: "Cancelar" }), _jsx("button", { onClick: onImport, className: "btn-primary", children: "Importar" })] })] }) }));
}
