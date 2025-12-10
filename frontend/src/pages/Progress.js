import React, { useEffect, useState } from 'react';
import { progressAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './Progress.css';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressAPI.get();
      setProgress(response.data.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
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

  if (!progress) {
    return (
      <div>
        <Navbar />
        <div className="container">Failed to load progress data</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Study Progress</h1>

        <div className="progress-grid">
          <div className="progress-card">
            <h3>Note Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Notes</span>
              <span className="stat-value">{progress.notes.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Created in Last 7 Days</span>
              <span className="stat-value">{progress.notes.recent}</span>
            </div>
          </div>

          <div className="progress-card">
            <h3>Review Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Total Review Plans</span>
              <span className="stat-value">{progress.reviews.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value completed">{progress.reviews.completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{progress.reviews.pending}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Overdue</span>
              <span className="stat-value overdue">{progress.reviews.overdue}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Upcoming (Next 7 Days)</span>
              <span className="stat-value">{progress.reviews.upcoming}</span>
            </div>
          </div>

          <div className="progress-card highlight">
            <h3>Completion Rate</h3>
            <div className="completion-circle">
              <div className="circle-content">
                <span className="percentage">{progress.reviews.completionRate}%</span>
                <span className="label">Completion Rate</span>
              </div>
            </div>
          </div>
        </div>

        {progress.reviews.total > 0 && (
          <div className="progress-chart">
            <h2>Review Progress Visualization</h2>
            <div className="chart-container">
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar-label">Completed</div>
                  <div className="bar">
                    <div
                      className="bar-fill completed"
                      style={{
                        width: `${(progress.reviews.completed / progress.reviews.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{progress.reviews.completed}</div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Pending</div>
                  <div className="bar">
                    <div
                      className="bar-fill pending"
                      style={{
                        width: `${(progress.reviews.pending / progress.reviews.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{progress.reviews.pending}</div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Overdue</div>
                  <div className="bar">
                    <div
                      className="bar-fill overdue"
                      style={{
                        width: `${(progress.reviews.overdue / progress.reviews.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{progress.reviews.overdue}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;

