import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import './Admin.css';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Appetizers',
    image: ''
  });

  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Drinks', 'Specials'];

  // Load menu items from localStorage on mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const savedItems = JSON.parse(localStorage.getItem('adminMenuItems') || '[]');
    if (savedItems.length === 0) {
      // Initialize with default items from existing menu
      const defaultItems = [
        { id: 1, name: 'Bruschetta al Pomodoro', description: 'Toasted artisan bread, fresh tomatoes, garlic, basil, balsamic glaze', price: '$12.00', category: 'Appetizers', image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=200&h=200&fit=crop' },
        { id: 2, name: 'Calamari Fritti', description: 'Lightly fried calamari served with a zesty marinara sauce and lemon', price: '$15.00', category: 'Appetizers', image: 'https://images.unsplash.com/photo-1578320338172-943b62e07e42?w=200&h=200&fit=crop' },
        { id: 3, name: 'Spaghetti Carbonara', description: 'Classic pasta with pancetta, egg yolk, pecorino cheese, and black pepper.', price: '$22.00', category: 'Main Courses', image: null },
        { id: 4, name: 'Grilled Salmon', description: 'Served with roasted asparagus and a lemon-dill sauce.', price: '$28.00', category: 'Main Courses', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop' },
        { id: 5, name: 'Ribeye Steak', description: '12oz prime ribeye, garlic mashed potatoes, and seasonal vegetables', price: '$35.00', category: 'Main Courses', image: null },
        { id: 6, name: 'Tiramisu', description: 'Ladyfingers dipped in coffee, layered with mascarpone cream, and cocoa.', price: '$10.00', category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200&h=200&fit=crop' },
        { id: 7, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.', price: '$11.00', category: 'Desserts', image: null },
        { id: 8, name: 'Espresso Martini', description: 'Vodka, coffee liqueur, and freshly brewed espresso.', price: '$14.00', category: 'Drinks', image: null },
        { id: 9, name: 'House Red Wine', description: 'A smooth and balanced Chianti from Tuscany.', price: '$9.00 / glass', category: 'Drinks', image: null }
      ];
      localStorage.setItem('adminMenuItems', JSON.stringify(defaultItems));
      setMenuItems(defaultItems);
    } else {
      setMenuItems(savedItems);
    }
  };

  const saveMenuItems = (items) => {
    localStorage.setItem('adminMenuItems', JSON.stringify(items));
    setMenuItems(items);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Appetizers',
      image: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      saveMenuItems(updatedItems);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
      saveMenuItems(updatedItems);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        ...formData
      };
      saveMenuItems([...menuItems, newItem]);
    }
    setShowAddModal(false);
    setEditingItem(null);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Menu Management</h1>
            <p className="admin-description">Add, edit, and remove items from your restaurant's menu.</p>
          </div>
          <button className="add-item-btn" onClick={handleAdd}>
            <FaPlus />
            Add New Item
          </button>
        </div>

        <div className="admin-filters">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for a menu item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card-admin">
              <div className="menu-item-image-wrapper">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="menu-item-image-admin" />
                ) : (
                  <div className="menu-item-placeholder">No Image</div>
                )}
                <div className="menu-item-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="menu-item-info-admin">
                <h3 className="menu-item-name-admin">{item.name}</h3>
                <p className="menu-item-price-admin">{item.price}</p>
                <span className="menu-item-category-admin">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>No menu items found. Click "Add New Item" to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$12.00"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Courses">Main Courses</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Specials">Specials</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

