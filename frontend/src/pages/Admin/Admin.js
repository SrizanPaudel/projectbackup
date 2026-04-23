import React, { useState } from 'react';
import { useProperties } from '../../context/PropertiesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import MapPicker from './MapPicker'; 

const Admin = () => {
  const { properties, addProperty, removeProperty, loading, error } = useProperties();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
   location: '',
coordinates: null,
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    image: '🏠',
  });

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coordinates) {
    alert("Please select a precise location on the map first!");
    return;
  }
    setSubmitting(true);
    
   const newProperty = {
    ...formData, // This carries over 'title', 'location', 'price', etc.
    // Ensure coordinates are structured for your backend/map view later
    coordinates: formData.coordinates, 
    price: `Rs. ${formData.price}/month`,
    bedrooms: parseInt(formData.bedrooms),
    bathrooms: parseInt(formData.bathrooms),
  };
  
  const result = await addProperty(newProperty);
    setSubmitting(false);
    
    if (result.success) {
      setFormData({
        title: '',
        location: '',
        coordinates: null,
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        image: '🏠',
      });
      setShowAddForm(false);
    } else {
      alert(result.error || 'Failed to add property');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const result = await removeProperty(id);
      if (!result.success) {
        alert(result.error || 'Failed to delete property');
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your property listings</p>
          {error && (
            <div className="error-banner">
              ⚠️ {error} (Using local storage as fallback)
            </div>
          )}
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-add-property"
          >
            {showAddForm ? 'Cancel' : '+ Add New Property'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-property-form">
            <h2>Add New Property</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Property Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Modern Apartment in Thamel"
                  />
                </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
  <label>Property Precise Location</label>
  <MapPicker 
    currentCoords={formData.coordinates}
    setCoordinates={(coords) => setFormData({ ...formData, coordinates: coords })} 
    setLocationName={(name) => setFormData(prev => ({ ...prev, location: name }))}
  />
  {formData.location && (
    <p style={{ marginTop: '10px', fontSize: '13px', color: '#555' }}>
      <strong>Selected:</strong> {formData.location}
    </p>
  )}
</div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Monthly Rent (NPR)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 25000"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="area">Area (sq ft)</label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1,200 sq ft"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bathrooms">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="image">Emoji Icon</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="🏠"
                    maxLength="2"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit-form"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Property'}
              </button>
            </form>
          </div>
        )}

        <div className="properties-list">
          <h2>Current Listings ({properties.length})</h2>
          {loading ? (
            <p className="no-properties">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="no-properties">No properties listed yet. Add your first property!</p>
          ) : (
            <div className="admin-properties-grid">
              {properties.map((property) => (
                <div key={property.id} className="admin-property-card">
                  <div className="admin-property-image">
                    <span className="property-emoji">{property.image}</span>
                  </div>
                  <div className="admin-property-content">
                    <h3>{property.title}</h3>
                    <p className="property-location">📍 {property.location}</p>
                    <div className="property-details">
                      <span>🛏️ {property.bedrooms} Bed</span>
                      <span>🚿 {property.bathrooms} Bath</span>
                      <span>📐 {property.area}</span>
                    </div>
                    <div className="property-price">{property.price}</div>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="btn-delete"
                    >
                      Delete Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;

