import React from 'react';
import './Menu.css';

export default function MenuItem({ name, description, price, image, fullWidth }) {
  return (
    <div className={`menu-item-card ${fullWidth ? 'full-width' : ''}`}>
      <div className="menu-item-content">
        {image && (
          <div className="menu-item-image-container">
            <img src={image} alt={name} className="menu-item-image" />
          </div>
        )}
        {!image && (
          <div className="menu-item-image-container" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {name}
          </div>
        )}
        <div className="menu-item-info">
          <h3 className="menu-item-name">{name}</h3>
          <p className="menu-item-description">{description}</p>
          <p className="menu-item-price">{price}</p>
        </div>
      </div>
    </div>
  );
}

