import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Find Your Perfect Rental Property</h1>
        <p className="hero-subtitle">
          Discover amazing homes and apartments in prime locations. Your dream
          rental is just a click away.
        </p>
        <div className="hero-buttons">
          <a href="#properties" className="btn-primary">
            Browse Properties
          </a>
          <a href="#contact" className="btn-secondary">
            Contact Us
          </a>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-placeholder">
          <span>🏠</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;

