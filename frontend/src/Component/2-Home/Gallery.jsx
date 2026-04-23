import React from 'react';
import './Home.css';

export default function Gallery() {
  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
      alt: 'Restaurant interior'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
      alt: 'Gourmet dish'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=700&q=80',
      alt: 'Cocktail'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=80',
      alt: 'Chef preparing food'
    }
  ];

  return (
    <section className="gallery-section fade-in-section">
      <h2 className="gallery-title slide-up-item">Discover Our Gallery</h2>
      <p className="gallery-subtitle slide-up-item">
        A glimpse into the moments and flavors that define The Gourmet Table experience.
      </p>
      <div className="gallery-grid">
        {galleryImages.map((image) => (
          <div key={image.id} className="gallery-item slide-up-item">
            <img
              src={image.url}
              alt={image.alt}
              className="gallery-image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

