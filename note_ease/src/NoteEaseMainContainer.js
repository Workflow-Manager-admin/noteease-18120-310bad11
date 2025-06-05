import React, { useState } from "react";
import "./App.css";

/*
  Main container for the NoteEase app.
  Layout includes:
    - Fixed header bar with app name
    - Search bar
    - Category/tag filter chips (shown as horizontal scrollable buttons)
    - List of notes (title + snippet)
    - Floating action button for new note creation (FAB, bottom right)
    
  Colors from project settings:
    --primary:    #4A90E2 (blue)
    --secondary:  #FFFFFF (white)
    --accent:     #F5A623 (orange)
  
  To be integrated into App.js.
*/

// PUBLIC_INTERFACE
function NoteEaseMainContainer() {
  // Demo notes and categories until full features implemented
  const initialNotes = [
    { id: 1, title: "Welcome to NoteEase", content: "Start taking notes!", category: "General" },
    { id: 2, title: "Shopping List", content: "Milk, Eggs, Bread, Butter", category: "Personal" },
    { id: 3, title: "Work Tasks", content: "Finish project report", category: "Work" }
  ];
  const categories = ["All", "General", "Personal", "Work"];

  const [notes] = useState(initialNotes);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Filter notes by search and category
  const displayedNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesSearch = (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="noteease-app-outer">
      {/* Header */}
      <header className="noteease-navbar">
        <div className="noteease-logo">
          <span className="logo-symbol" style={{ color: "#4A90E2" }}>✏️</span>
          <span style={{ fontWeight: 600, marginLeft: 8 }}>NoteEase</span>
        </div>
      </header>

      {/* Content */}
      <main className="noteease-main-container">
        {/* Search bar */}
        <div className="noteease-searchbar-container">
          <input
            type="text"
            className="noteease-searchbar"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search notes"
          />
        </div>

        {/* Category filter chips */}
        <div className="noteease-category-chips" role="list">
          {categories.map(cat => (
            <button
              key={cat}
              className={`noteease-chip${selectedCategory === cat ? " selected" : ""}`}
              style={{
                background: selectedCategory === cat ? "#4A90E2" : "#f4f8ff",
                color: selectedCategory === cat ? "#FFF" : "#224",
              }}
              onClick={() => setSelectedCategory(cat)}
              role="listitem"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes List */}
        <div className="noteease-notes-list">
          {displayedNotes.length === 0 && (
            <div className="noteease-empty-msg">No notes found.</div>
          )}
          {displayedNotes.map(note => (
            <div key={note.id} className="noteease-note-preview-card">
              <div className="noteease-note-title">{note.title}</div>
              <div className="noteease-note-snippet">{note.content}</div>
              {note.category && (
                <span className="noteease-note-category-tag">{note.category}</span>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        className="noteease-fab"
        title="Add Note"
        aria-label="Add new note"
        // onClick={handleAddNote}  // IMPLEMENT in next step
      >
        <span className="noteease-fab-plus">＋</span>
      </button>
    </div>
  );
}

export default NoteEaseMainContainer;
