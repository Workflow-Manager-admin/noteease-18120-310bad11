import React, { useState } from "react";
import "./App.css";

/*
  Main container for the NoteEase app. Now fully interactive!
  - Allows creating, editing, deleting notes.
  - Supports searching notes by title/content.
  - Filtering by category chips (tag).
  - Floating Action Button triggers new/edit note modal/area.

  Notes:
    - No persistent storage here (in-memory only).
    - No advanced formatting.
    - All UI state handled in this component.
*/

function getNextNoteId(notes) {
  // Find max id and add 1, fallback to 1
  return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
}

// PUBLIC_INTERFACE
function NoteEaseMainContainer() {
  // Initial notes & dynamic categories
  const initialNotes = [
    { id: 1, title: "Welcome to NoteEase", content: "Start taking notes!", category: "General" },
    { id: 2, title: "Shopping List", content: "Milk, Eggs, Bread, Butter", category: "Personal" },
    { id: 3, title: "Work Tasks", content: "Finish project report", category: "Work" }
  ];

  // State hooks
  const [notes, setNotes] = useState(initialNotes);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // For modal/note form purposes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // note object or null

  // UI state for form fields
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("");

  // Derived categories, always include existing and All
  const categories = ["All", ...Array.from(new Set(notes.map(note => note.category).filter(Boolean)))];

  // Filter notes by search and category
  const displayedNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    const matchesSearch = (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  // Open form for creating a new note
  function handleAddNote() {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("");
    setIsFormOpen(true);
  }

  // Open form for editing existing note
  function handleEditNote(note) {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category || "");
    setIsFormOpen(true);
  }

  // Cancel creating/editing a note
  function handleCancelForm() {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("");
    setIsFormOpen(false);
  }

  // Submit handler: create or edit
  function handleFormSubmit(e) {
    e.preventDefault();

    const trimmedTitle = formTitle.trim();
    const trimmedContent = formContent.trim();
    const trimmedCategory = formCategory.trim() || "General";

    if (!trimmedTitle && !trimmedContent) {
      // Don't allow empty notes
      return;
    }

    if (editingNote) {
      // Edit existing note
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === editingNote.id
            ? { ...n, title: trimmedTitle, content: trimmedContent, category: trimmedCategory }
            : n
        )
      );
    } else {
      // Create new note
      const newNote = {
        id: getNextNoteId(notes),
        title: trimmedTitle || "(Untitled)",
        content: trimmedContent,
        category: trimmedCategory
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
    }
    handleCancelForm();
  }

  // Delete a note
  function handleDeleteNote(noteId) {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    // If we were editing this note, close form
    if (editingNote && editingNote.id === noteId) {
      handleCancelForm();
    }
  }

  // Category chip handler
  function handleCategoryClick(cat) {
    setSelectedCategory(cat);
  }

  // UI: Lightweight modal form overlay for create/edit note
  function renderNoteFormModal() {
    if (!isFormOpen)
      return null;

    return (
      <div style={{
        position: "fixed",
        zIndex: 100,
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(40,55,95,0.20)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      }}>
        <div style={{
          marginTop: 90,
          background: "#fff",
          borderRadius: 12,
          padding: "26px 28px 20px 28px",
          boxShadow: "0 4px 32px rgba(100,125,175,0.13)",
          minWidth: 320, maxWidth: 430, width: "92%",
          color: "#284262"
        }}>
          <form onSubmit={handleFormSubmit}>
            <div style={{ fontWeight: 700, fontSize: "1.17rem", marginBottom: 16 }}>
              {editingNote ? "Edit Note" : "New Note"}
            </div>
            <div>
              <label style={{ fontSize: ".98rem" }}>
                Title:
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  maxLength={80}
                  autoFocus
                  style={{
                    width: "100%",
                    margin: "6px 0 14px 0",
                    padding: "7px 8.5px",
                    border: "1.2px solid #dee3fb",
                    borderRadius: 5,
                    fontSize: "1.04rem"
                  }}
                  placeholder="Note Title"
                />
              </label>
            </div>
            <div>
              <label style={{ fontSize: ".98rem" }}>
                Content:
                <textarea
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  rows={5}
                  style={{
                    width: "100%",
                    margin: "6px 0 14px 0",
                    padding: "7px 8.5px",
                    border: "1.2px solid #dee3fb",
                    borderRadius: 5,
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                  placeholder="Write your note here..."
                />
              </label>
            </div>
            <div>
              <label style={{ fontSize: ".98rem" }}>
                Category:
                <input
                  type="text"
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  style={{
                    width: "100%",
                    margin: "6px 0 7px 0",
                    padding: "7px 8.5px",
                    border: "1.2px solid #dee3fb",
                    borderRadius: 5,
                    fontSize: "1.02rem"
                  }}
                  placeholder="Category (e.g., Personal, Work)"
                />
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 3 }}>
              {editingNote && (
                <button
                  type="button"
                  style={{
                    color: "#fff",
                    background: "#e85353",
                    border: "none",
                    borderRadius: 5,
                    fontWeight: 500,
                    fontSize: ".98rem",
                    padding: "7px 15px",
                    marginRight: "auto"
                  }}
                  onClick={() => handleDeleteNote(editingNote.id)}
                  title="Delete this note"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={handleCancelForm}
                style={{
                  background: "none",
                  border: "1px solid #b1becd",
                  borderRadius: 5,
                  color: "#47607b",
                  fontWeight: 500,
                  fontSize: ".97rem",
                  padding: "7px 15px"
                }}>
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  background: "#4A90E2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  fontWeight: 500,
                  fontSize: ".98rem",
                  padding: "7px 17px"
                }}
              >
                {editingNote ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
              onClick={() => handleCategoryClick(cat)}
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
            <div
              key={note.id}
              className="noteease-note-preview-card"
              tabIndex={0}
              title="View/edit note"
              onClick={() => handleEditNote(note)}
              onKeyPress={e => {
                if (e.key === "Enter" || e.key === " ") handleEditNote(note);
              }}
              style={{ cursor: "pointer" }}
              aria-label={`Open note ${note.title}`}
            >
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
        onClick={handleAddNote}
      >
        <span className="noteease-fab-plus">＋</span>
      </button>

      {/* Modal for creating/editing notes */}
      {renderNoteFormModal()}
    </div>
  );
}

export default NoteEaseMainContainer;
