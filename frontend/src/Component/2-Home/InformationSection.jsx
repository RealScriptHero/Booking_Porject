import React from 'react';
import { FaClock, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import './Home.css';

export default function InformationSection() {
  return (
    <section className="information-section">
      <div className="info-container">
        <div className="info-column">
          <FaClock className="info-icon" />
          <h3 className="info-title">Opening Hours</h3>
          <p className="info-text">Mon - Fri: 12pm - 10pm</p>
          <p className="info-text">Sat - Sun: 11am - 11pm</p>
        </div>
        <div className="info-column">
          <FaMapMarkerAlt className="info-icon" />
          <h3 className="info-title">Location</h3>
          <p className="info-text">123 Culinary Lane, Foodie City</p>
          <a href="#directions" className="info-link">Get Directions</a>
        </div>
        <div className="info-column">
          <FaUtensils className="info-icon" />
          <h3 className="info-title">Cuisine</h3>
          <p className="info-text">Modern European, Seasonal</p>
          <a href="#menu" className="info-link">View Full Menu</a>
        </div>
      </div>
    </section>
  );
}

