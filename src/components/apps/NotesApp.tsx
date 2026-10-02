import React, { useState } from 'react';
import { X, Plus, Trash2, Search, Check, Sparkles } from 'lucide-react';
import { NoteItem } from '../../types/launcher';
import { playTapSound } from '../../utils/sound';

interface NotesAppProps {
  onClose: () => void;
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({
  onClose,
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!newTitle.trim()) return;
    playTapSound(700);

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      date: 'Just now',
      color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-100',
    };

    onAddNote(newNote);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight text-white">SUNNY Notes</h2>
          <span className="text-xs text-amber-400 font-medium">MagicOS 11</span>
        </div>
        <button
          type="button"
          onClick={() => {
            playTapSound(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
          aria-label="Close Notes"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes & checklists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            No notes found. Tap '+' to create one!
          </div>
        ) : (
          filteredNotes.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-[24px] bg-gradient-to-br ${n.color} border shadow-lg flex flex-col justify-between gap-2`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold text-white">{n.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    playTapSound(500);
                    onDeleteNote(n.id);
                  }}
                  className="text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">{n.content}</p>
              <span className="text-[10px] text-neutral-400 font-mono">{n.date}</span>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Note Button */}
      <div className="p-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            playTapSound(600);
            setIsCreating(true);
          }}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-neutral-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Create Note Sheet */}
      {isCreating && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in"
          onClick={() => setIsCreating(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-[32px] p-5 shadow-2xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-sm font-bold text-white">New SUNNY Note</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Note Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
            />

            <textarea
              rows={4}
              placeholder="Write your note here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-400"
            ></textarea>

            <button
              type="button"
              onClick={handleSave}
              disabled={!newTitle.trim()}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md disabled:opacity-50 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
