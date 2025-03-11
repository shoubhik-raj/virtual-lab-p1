import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, PenLine } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  content: string;
  department: string;
  date: string;
  color: string;
}

const COLORS = [
  'bg-yellow-100',
  'bg-green-100',
  'bg-blue-100',
  'bg-purple-100',
  'bg-pink-100',
];

export default function LabNotebook() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('labNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    department: 'Electronics & Communications',
  });

  useEffect(() => {
    localStorage.setItem('labNotes', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: uuidv4(),
        ...newNote,
        date: new Date().toISOString(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', department: 'Electronics & Communications' });
      setIsCreating(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lab Notebook</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Note
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              value={newNote.department}
              onChange={(e) => setNewNote({ ...newNote, department: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Electronics & Communications</option>
              <option>Computer Science & Engineering</option>
              <option>Electrical Engineering</option>
              <option>Biotechnology and Biomedical Engineering</option>
            </select>
            <textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-32"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`${note.color} p-6 rounded-lg shadow-md relative group`}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-1 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <p className="text-sm text-gray-600">{note.department}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.date).toLocaleDateString()}
                </p>
              </div>
              <PenLine className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}