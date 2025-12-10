import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './NoteEditor.css';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await notesAPI.getOne(id);
      const note = response.data.data;
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags.join(', '),
      });
    } catch (error) {
      console.error('Error fetching note:', error);
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const noteData = {
      title: formData.title,
      content: formData.content,
      tags: tagsArray,
    };

    try {
      if (isNew) {
        await notesAPI.create(noteData);
      } else {
        await notesAPI.update(id, noteData);
      }
      navigate('/notes');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save note, please try again');
    } finally {
      setSaving(false);
    }
  };

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
        <div className="editor-header">
          <h1>{isNew ? 'New Note' : 'Edit Note'}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter note title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="20"
              placeholder="Enter note content..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Math, Review, Important"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;

