import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notesAPI, reviewPlanAPI, progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [upcomingReviews, setUpcomingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesRes, reviewsRes, progressRes] = await Promise.all([
        notesAPI.getAll(),
        reviewPlanAPI.getAll(),
        progressAPI.get(),
      ]);

      setRecentNotes(notesRes.data.data.slice(0, 5));
      
      const now = new Date();
      const upcoming = reviewsRes.data.data
        .filter(review => new Date(review.review_date) >= now && review.status !== 'completed')
        .slice(0, 5);
      setUpcomingReviews(upcoming);
      
      setStats(progressRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
        <div className="home-header">
          <h1>Welcome Back!</h1>
          <p>This is your learning dashboard</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Notes</h3>
              <p className="stat-number">{stats.notes.total}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Reviews</h3>
              <p className="stat-number">{stats.reviews.completed}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Reviews</h3>
              <p className="stat-number">{stats.reviews.pending}</p>
            </div>
            <div className="stat-card">
              <h3>Completion Rate</h3>
              <p className="stat-number">{stats.reviews.completionRate}%</p>
            </div>
          </div>
        )}

        <div className="content-grid">
          <div className="content-card">
            <div className="card-header">
              <h2>Recent Notes</h2>
              <Link to="/notes" className="view-all">View All</Link>
            </div>
            {recentNotes.length === 0 ? (
              <p className="empty-message">No notes yet, <Link to="/notes">create your first note</Link></p>
            ) : (
              <ul className="note-list">
                {recentNotes.map((note) => (
                  <li key={note._id}>
                    <Link to={`/notes/${note._id}`}>
                      <h4>{note.title}</h4>
                      <p>{new Date(note.updatedAt).toLocaleDateString()}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="content-card">
            <div className="card-header">
              <h2>Upcoming Reviews</h2>
              <Link to="/review-plans" className="view-all">View All</Link>
            </div>
            {upcomingReviews.length === 0 ? (
              <p className="empty-message">No upcoming reviews, <Link to="/review-plans">create a review plan</Link></p>
            ) : (
              <ul className="review-list">
                {upcomingReviews.map((review) => (
                  <li key={review._id}>
                    <h4>{new Date(review.review_date).toLocaleDateString()}</h4>
                    <p>{review.note_ids.length} notes to review</p>
                    <span className={`status-badge ${review.status}`}>
                      {review.status === 'pending' ? 'Pending' : review.status === 'overdue' ? 'Overdue' : 'Completed'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

