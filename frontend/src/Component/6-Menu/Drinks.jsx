import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';

export default function Drinks({ searchTerm }) {
  const [drinks, setDrinks] = useState([]);

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
          name: 'Espresso Martini',
          description: 'Vodka, coffee liqueur, and freshly brewed espresso.',
          price: '$14.00',
          category: 'Drinks',
          image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'House Red Wine',
          description: 'A smooth and balanced Chianti from Tuscany.',
          price: '$9.00 / glass',
          category: 'Drinks',
          image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop'
        }
      ];
      setDrinks(defaultItems);
    } else {
      // Filter items by category
      const drinkItems = allItems.filter(item => item.category === 'Drinks');
      setDrinks(drinkItems);
    }
  };

  const filteredItems = drinks.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="menu-section">
      <h2 className="menu-section-title">Drinks</h2>
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

