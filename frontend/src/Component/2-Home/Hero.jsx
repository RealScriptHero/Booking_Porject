import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">An Unforgettable Culinary Journey</h1>
        <p className="hero-subtitle">Experience the finest seasonal ingredients, crafted with passion.</p>
        <button className="btn-reserve" onClick={() => navigate('/booking')}>
          Reserve Your Table
        </button>
      </div>
    </section>
  );
}

