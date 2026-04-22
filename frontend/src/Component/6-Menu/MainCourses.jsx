import React, { useState, useEffect } from 'react';
import MenuItem from './MenuItem';
import './Menu.css';

export default function MainCourses({ searchTerm }) {
  const [mainCourses, setMainCourses] = useState([]);

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
          name: 'Spaghetti Carbonara',
          description: 'Classic pasta with pancetta, egg yolk, pecorino cheese, and black pepper.',
          price: '$22.00',
          category: 'Main Courses',
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop',
          fullWidth: false
        },
        {
          id: 2,
          name: 'Grilled Salmon',
          description: 'Served with roasted asparagus and a lemon-dill sauce.',
          price: '$28.00',
          category: 'Main Courses',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
          fullWidth: false
        },
        {
          id: 3,
          name: 'Ribeye Steak',
          description: '12oz prime ribeye, garlic mashed potatoes, and seasonal vegetables',
          price: '$35.00',
          category: 'Main Courses',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop',
          fullWidth: true
        }
      ];
      setMainCourses(defaultItems);
    } else {
      // Filter items by category
      const mainCourseItems = allItems.filter(item => item.category === 'Main Courses');
      setMainCourses(mainCourseItems);
    }
  };

  const filteredItems = mainCourses.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="menu-section">
      <h2 className="menu-section-title">Main Courses</h2>
      <div className="menu-items-grid">
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            fullWidth={item.fullWidth}
          />
        ))}
      </div>
    </section>
  );
}

