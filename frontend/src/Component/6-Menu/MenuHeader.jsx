import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './Menu.css';

export default function MenuHeader({ searchTerm, onSearchChange }) {
  return (
    <div className="menu-header">
      <div className="menu-header-left">
        <h1 className="menu-title">Our Menu</h1>
        <p className="menu-description">
          A selection of our finest dishes, crafted with fresh, locally-sourced ingredients.
        </p>
      </div>
      <div className="menu-search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="menu-search"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

