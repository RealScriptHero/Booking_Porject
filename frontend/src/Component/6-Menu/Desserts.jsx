import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';

export default function Desserts({ searchTerm }) {
  const [desserts, setDesserts] = useState([]);

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
          name: 'Tiramisu',
          description: 'Ladyfingers dipped in coffee, layered with mascarpone cream, and cocoa.',
          price: '$10.00',
          category: 'Desserts',
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
          price: '$11.00',
          category: 'Desserts',
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop'
        }
      ];
      setDesserts(defaultItems);
    } else {
      // Filter items by category
      const dessertItems = allItems.filter(item => item.category === 'Desserts');
      setDesserts(dessertItems);
    }
  };

  const filteredItems = desserts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="menu-section">
      <h2 className="menu-section-title">Desserts</h2>
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

