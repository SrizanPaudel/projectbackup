import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find properties quickly with our advanced search filters',
    },
    {
      icon: '💼',
      title: 'Verified Listings',
      description: 'All properties are verified and checked for authenticity',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive rental prices with no hidden fees',
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Browse and book properties on any device',
    },
    {
      icon: '🔒',
      title: 'Secure Process',
      description: 'Safe and secure rental process with legal protection',
    },
    {
      icon: '⭐',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs',
    },
  ];

  return (
    <div className="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            We make finding your perfect rental property simple and stress-free
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

