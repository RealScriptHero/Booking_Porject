import React, { useEffect, useState } from 'react';
import './Home.css';

const testimonials = [
  {
    quote: "An absolute gem. The ambiance is matched only by the exquisite quality of the food. Every dish was a masterpiece. We'll be back soon!",
    name: 'Jessica L.',
    role: 'Frequent Diner'
  },
  {
    quote: "The service was exceptional and the flavors were unforgettable. This restaurant has become our new favorite spot.",
    name: 'Michael S.',
    role: 'Food Enthusiast'
  },
  {
    quote: "A beautifully curated menu with dishes that truly delight. The atmosphere and staff made our evening perfect.",
    name: 'Sophia R.',
    role: 'Regular Guest'
  }
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsVisible(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 300);
  };

  return (
    <section className="testimonial-section">
      <h2 className="testimonial-title">What Our Guests Say</h2>
      <div
        className="testimonial-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out'
        }}
      >
        <p className="testimonial-quote">{testimonials[currentIndex].quote}</p>
        <div className="testimonial-author">
          <span className="author-name">{testimonials[currentIndex].name}</span>
          <span className="author-role">{testimonials[currentIndex].role}</span>
        </div>
        <div className="testimonial-pagination">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

