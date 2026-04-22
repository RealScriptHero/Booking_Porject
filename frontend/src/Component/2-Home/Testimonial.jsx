import React from 'react';
import './Home.css';

export default function Testimonial() {
  return (
    <section className="testimonial-section">
      <h2 className="testimonial-title">What Our Guests Say</h2>
      <div className="testimonial-content">
        <p className="testimonial-quote">
          "An absolute gem. The ambiance is matched only by the exquisite quality of the food. Every dish was a masterpiece. We'll be back soon!"
        </p>
        <div className="testimonial-author">
          <span className="author-name">Jessica L.</span>
          <span className="author-role">Frequent Diner</span>
        </div>
        <div className="testimonial-pagination">
          <span className="pagination-dot"></span>
          <span className="pagination-dot active"></span>
          <span className="pagination-dot"></span>
        </div>
      </div>
    </section>
  );
}

