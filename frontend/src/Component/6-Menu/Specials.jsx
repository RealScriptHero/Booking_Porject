import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';

export default function Specials({ searchTerm }) {
  const [specials, setSpecials] = useState([]);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const allItems = JSON.parse(localStorage.getItem('adminMenuItems') || '[]');
    // If no items in localStorage, use default
    if (allItems.length === 0) {
      const defaultItems = [
        {
          id: 1,
          name: 'Chef\'s Special Pasta',
          description: 'Today\'s featured pasta dish prepared with seasonal ingredients.',
          price: '$24.00',
          category: 'Specials',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&h=200&fit=crop'
        }
      ];
      setSpecials(defaultItems);
    } else {
      // Filter items by category
      const specialItems = allItems.filter(item => item.category === 'Specials');
      setSpecials(specialItems);
    }
  };

  const filteredItems = specials.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="menu-section">
      <h2 className="menu-section-title">Specials</h2>
      <div className="menu-items-grid">
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}

