import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';

export default function Appetizers({ searchTerm }) {
  const [appetizers, setAppetizers] = useState([]);

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
          name: 'Bruschetta al Pomodoro',
          description: 'Toasted artisan bread, fresh tomatoes, garlic, basil, balsamic glaze',
          price: '$12.00',
          category: 'Appetizers',
          image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=200&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'Calamari Fritti',
          description: 'Lightly fried calamari served with a zesty marinara sauce and lemon',
          price: '$15.00',
          category: 'Appetizers',
          image: 'https://images.unsplash.com/photo-1578320338172-943b62e07e42?w=200&h=200&fit=crop'
        }
      ];
      setAppetizers(defaultItems);
    } else {
      // Filter items by category
      const appetizerItems = allItems.filter(item => item.category === 'Appetizers');
      setAppetizers(appetizerItems);
    }
  };

  const filteredItems = appetizers.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="menu-section">
      <h2 className="menu-section-title">Appetizers</h2>
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

