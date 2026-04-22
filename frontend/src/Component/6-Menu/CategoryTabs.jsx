import React from 'react';
import './Menu.css';

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Specials'];

  return (
    <div className="category-tabs">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-tab ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

