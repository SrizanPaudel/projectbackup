import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '../../context/PropertiesContext';
import { adminAPI } from '../../services/api';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams(); // This id acts as our roomId
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review handling states
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // MOCK USER ID (Replace this with your real logged-in User Context ID later)
  const currentUserId = "65f8c3e4b2d1a34c88888888"; 

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        try {
          const data = await adminAPI.getPropertyById(id);
          setProperty(data);
          // If backend provides populated reviews, load them, otherwise use fallback layout
          setReviews(data.reviews || getMockReviews());
        } catch (err) {
          const foundProperty = properties.find(p => p.id === parseInt(id) || p._id === id);
          if (foundProperty) {
            setProperty(foundProperty);
            setReviews(foundProperty.reviews || getMockReviews());
          } else {
            console.error('Property not found');
          }
        }
      } catch (err) {
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, properties]);

  const getMockReviews = () => [
    {
      _id: "1",
      userId: { name: "Sarah Jenkins" },
      avatar: "👩‍💼",
      rating: 5,
      censoredReview: "Absolutely stunning place. The neighborhood is incredibly quiet.",
      createdAt: "2026-06-10T12:00:00.000Z"
    }
  ];
  const [successMessage, setSuccessMessage] = useState('');
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorMessage("Please select a star rating before submitting.");
      return;
    }
    if (!reviewText.trim()) {
      setErrorMessage("Review text cannot be empty.");
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    // 🛠️ FIX COERCION: Check if the current route id is a valid 24-char hex string.
  // If it's a numeric mock id (like 1779167707499), swap it out with a valid test ObjectId
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const cleanRoomId = isValidObjectId ? id : "65f8c3e4b2d1a34c99999999";

    try {
    // Pass 'cleanRoomId' instead of the raw route 'id'
    const savedReviewFromDB = await adminAPI.postReview(cleanRoomId, currentUserId, rating, reviewText);
    // 📋 Check if the AI flagged it for the superadmin queue
    if (savedReviewFromDB.status === 'pending') {
      setSuccessMessage("📨 Your review contains sensitive content and has been sent to our Superadmin team for approval before going public.");
    } else {
      // Safe review: update the UI feed list immediately
    const updatedReviewForUI = {
      _id: savedReviewFromDB._id,
      userId: { name: "You" },
      avatar: "👤",
      rating: savedReviewFromDB.rating,
      censoredReview: savedReviewFromDB.censoredReview, 
      createdAt: savedReviewFromDB.createdAt,
      aiAnalysis: savedReviewFromDB.aiAnalysis
   };
      setReviews([updatedReviewForUI, ...reviews]);
      setSuccessMessage("✅ Review posted successfully!");
    }

    // Reset fields
    setReviewText('');
    setRating(0);
  } catch (err) {
    setErrorMessage(err.message);
  } finally {
    setSubmitting(false);
  }
};

  const handleTalkToBroker = () => {
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return (
      <div className="property-detail">
        <div className="container">
          <div className="loading">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <div className="container">
          <div className="error">Property not found</div>
          <button onClick={() => navigate('/')} className="btn-back">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <div className="container">
        <button onClick={() => navigate('/')} className="btn-back">← Back to Properties</button>
        
        <div className="property-detail-content">
          <div className="property-detail-image">
            <span className="property-emoji-large">{property.image}</span>
          </div>
          
          <div className="property-detail-info">
            <h1 className="property-detail-title">{property.title}</h1>
            <p className="property-detail-location">📍 {property.location}</p>
            
            <div className="property-detail-specs">
              <div className="spec-item">
                <span className="spec-icon">🛏️</span>
                <span className="spec-label">Bedrooms</span>
                <span className="spec-value">{property.bedrooms}</span>
              </div>
              <div className="spec-item">
                <span className="spec-icon">🚿</span>
                <span className="spec-label">Bathrooms</span>
                <span className="spec-value">{property.bathrooms}</span>
              </div>
              <div className="spec-item">
                <span className="spec-icon">📐</span>
                <span className="spec-label">Area</span>
                <span className="spec-value">{property.area}</span>
              </div>
            </div>

            <div className="property-detail-price-section">
              <h2 className="property-detail-price">{property.price}</h2>
            </div>

            <div className="property-detail-actions">
              <button className="btn-talk-to-broker" onClick={handleTalkToBroker}>
                💬 Talk to Broker
              </button>
              <button 
                className="btn-location" 
                onClick={() => {
                  const { coordinates, location } = property;
                  const hasCoords = coordinates && coordinates.lat && coordinates.lng;
                  const url = hasCoords
                    ? `http://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`
                    : `http://maps.google.com/?q=${encodeURIComponent(location)}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                View exact location
              </button>
              <button className="btn-view" onClick={() => navigate('/')}>
                View More Properties
              </button>
            </div>
          </div>
        </div>

        {/* --- REVIEWS DISPLAY & SUBMISSION --- */}
        <div className="reviews-section">
          
          {/* List display */}
          <div className="reviews-display-pane">
            <h2>Community Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to express your thoughts!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-user-info">
                        <span className="user-avatar">{rev.avatar || "👤"}</span>
                        <div>
                          <h4 className="user-name">{rev.userId?.name || "Anonymous User"}</h4>
                          <span className="review-date">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="star-filled">
                            {i < rev.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Render the censoredReview text processed by your AI engine */}
                    <p className="review-text">{rev.censoredReview}</p>
                    {rev.aiAnalysis?.isToxicContext && (
                      <span className="ai-flag-tag">⚠️ Flagged by AI Moderation</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form display */}
          <div className="reviews-form-pane">
            <h2>Leave a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', fontSize: '2rem' }}
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>

              {errorMessage && <div className="review-error-banner">{errorMessage}</div>}
              {successMessage && <div className="review-success-banner">{successMessage}</div>}

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review... Note: Any vulgar text will automatically be filtered by our XLM-R classifier system."
                rows="4"
                disabled={submitting}
              />

              <button type="submit" disabled={submitting}>
                {submitting ? 'Running AI Moderation Check...' : 'Submit Review'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
