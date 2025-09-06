"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever the 'notes' state changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    if (noteContent.trim()) {
      const newNote = {
        id: Date.now(),
        content: noteContent.trim(),
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
      setNoteContent('');
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
  };

  const handleSaveEdit = (id) => {
    setNotes(notes.map(note => {
      if (note.id === id) {
        return { ...note, content: noteContent.trim() };
      }
      return note;
    }));
    setEditingNoteId(null);
    setNoteContent('');
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-500 to-green-500">
      <div className="relative flex w-[1200px] h-[700px] bg-white rounded-3xl shadow-2xl p-8 gap-8">
        
        {/* Left Column: Note Creation (dynamic width) */}
        <div className={`flex flex-col h-full ${isHistoryOpen ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
          <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-indigo-500">
            E-Notes
          </h1>
          
          <div className="bg-gray-100 p-6 rounded-xl shadow-inner flex-grow">
            <textarea
              className="w-full p-4 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800"
              rows="10"
              placeholder="Write a new note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            ></textarea>
            <button
              onClick={handleCreateNote}
              className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-purple-300 text-2xl font-bold transition-transform duration-300 hover:rotate-180">+</span> Add Note
            </button>
          </div>
        </div>

        {/* Right Column: Stored Notes (dynamic width) */}
        <div className={`flex-col h-full overflow-y-auto ${isHistoryOpen ? 'w-1/4 flex' : 'w-0 hidden'} transition-all duration-300`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">History</h2>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col flex-grow">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-lg border-b border-gray-200 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                {editingNoteId === note.id ? (
                  <div className="flex flex-col">
                    <textarea
                      className="w-full p-2 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                      rows="4"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleSaveEdit(note.id)}
                      className="mt-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full" onClick={() => handleEdit(note)}>
                    <p className="text-gray-800 mb-2 truncate">
                      {note.content.length > 50 ? `${note.content.slice(0, 50)}...` : note.content}
                    </p>
                    <div className="text-sm text-gray-500 flex justify-between items-center mt-auto">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Collapsible History Button (fixed position) */}
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors z-10`}
          aria-label={isHistoryOpen ? "Collapse history" : "Expand history"}
        >
          {isHistoryOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 transition-transform duration-300 hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 transition-transform duration-300 hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      <footer className="absolute bottom-4 text-sm text-gray-500 font-bold">
        ASTRONOMOX™
      </footer>

    </div>
  );
}