import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewPlanAPI, notesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ReviewPlans.css';

const ReviewPlans = () => {
  const [reviewPlans, setReviewPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    note_ids: [],
    review_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, notesRes] = await Promise.all([
        reviewPlanAPI.getAll(),
        notesAPI.getAll(),
      ]);
      setReviewPlans(reviewsRes.data.data);
      setNotes(notesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (formData.note_ids.length === 0 || !formData.review_date) {
      alert('Please select notes and date');
      return;
    }

    try {
      await reviewPlanAPI.create(formData);
      setShowCreateForm(false);
      setFormData({ note_ids: [], review_date: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating review plan:', error);
      alert('Failed to create review plan, please try again');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await reviewPlanAPI.update(id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status, please try again');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review plan?')) return;

    try {
      await reviewPlanAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting review plan:', error);
      alert('Failed to delete review plan, please try again');
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
        <div className="review-header">
          <h1>Review Plans</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-button"
          >
            + New Review Plan
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-card">
            <h3>New Review Plan</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Select Notes</label>
                {notes.length === 0 ? (
                  <p>No notes yet, <Link to="/notes/new">create a note</Link></p>
                ) : (
                  <div className="checkbox-list">
                    {notes.map((note) => (
                      <label key={note._id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.note_ids.includes(note._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                note_ids: [...formData.note_ids, note._id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                note_ids: formData.note_ids.filter(id => id !== note._id),
                              });
                            }
                          }}
                        />
                        {note.title}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="review_date">Review Date</label>
                <input
                  type="date"
                  id="review_date"
                  value={formData.review_date}
                  onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="create-submit-button">Create Review Plan</button>
              </div>
            </form>
          </div>
        )}

        {reviewPlans.length === 0 ? (
          <div className="empty-state">
            <p>No review plans yet</p>
          </div>
        ) : (
          <div className="review-plans-list">
            {reviewPlans.map((plan) => (
              <div key={plan._id} className="review-plan-card">
                <div className="plan-header">
                  <div className="plan-header-left">
                    <h3>{new Date(plan.review_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</h3>
                    <p>{plan.note_ids.length} {plan.note_ids.length === 1 ? 'note' : 'notes'}</p>
                  </div>
                  <span className={`status-badge ${plan.status}`}>
                    {plan.status === 'pending' ? 'Pending' : 
                     plan.status === 'completed' ? 'Completed' : 'Overdue'}
                  </span>
                </div>
                <div className="plan-notes">
                  {plan.note_ids.map((note) => (
                    <div key={note._id || note} className="plan-note-item">
                      {typeof note === 'object' ? note.title : 'Note'}
                    </div>
                  ))}
                </div>
                <div className="plan-actions">
                  {plan.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(plan._id, 'completed')}
                      className="complete-button"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPlans;

