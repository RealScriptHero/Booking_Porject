import React from 'react';
import './Home.css';

export default function Gallery() {
  // Placeholder images - you can replace these with actual image paths
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
      alt: 'Restaurant interior'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      alt: 'Gourmet dish'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
      alt: 'Cocktail'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
      alt: 'Chef preparing food'
    }
  ];

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Discover Our Gallery</h2>
      <p className="gallery-subtitle">
        A glimpse into the moments and flavors that define The Gourmet Table experience.
      </p>
      <div className="gallery-grid">
        {galleryImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.url} alt={image.alt} className="gallery-image" />
          </div>
        ))}
      </div>
    </section>
  );
}

