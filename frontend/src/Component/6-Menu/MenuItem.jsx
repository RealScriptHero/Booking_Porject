import React from 'react';
import './Menu.css';

export default function MenuItem({ name, description, price, image, fullWidth }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80';
  const generatedImage = `https://source.unsplash.com/featured/900x700/?${encodeURIComponent(`${name} food dish`)}`;
  const resolvedImage = image || generatedImage;

  return (
    <div className={`menu-item-card slide-up-item ${fullWidth ? 'full-width' : ''}`}>
      <div className="menu-item-content">
        <div className="menu-item-image-container">
          <img
            src={resolvedImage}
            alt={name}
            className="menu-item-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="menu-item-info">
          <h3 className="menu-item-name">{name}</h3>
          <p className="menu-item-description">{description}</p>
          <p className="menu-item-price">{price}</p>
        </div>
      </div>
    </div>
  );
}

