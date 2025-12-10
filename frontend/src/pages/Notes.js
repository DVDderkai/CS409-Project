import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.delete(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note, please try again');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="notes-header">
          <h1>My Notes</h1>
          <Link to="/notes/new" className="create-button">+ New Note</Link>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p>{searchTerm ? 'No matching notes found' : 'No notes yet'}</p>
            {!searchTerm && (
              <Link to="/notes/new" className="create-button">Create your first note</Link>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <Link to={`/notes/${note._id}`}>
                    <h3>{note.title}</h3>
                  </Link>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="delete-button"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
                <p className="note-preview">
                  {note.content.substring(0, 150)}
                  {note.content.length > 150 && '...'}
                </p>
                {note.tags.length > 0 && (
                  <div className="tags">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="note-footer">
                  <span className="note-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;

