import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import './Home.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-brand">The Gourmet Table</h3>
          <p className="footer-description">
            Crafting memorable dining experiences since 2000.
          </p>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">NAVIGATE</h4>
          <ul className="footer-links">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#reservations">Reservations</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">CONTACT</h4>
          <ul className="footer-contact">
            <li>123 Culinary Lane, Foodie City</li>
            <li>(123) 456-7890</li>
            <li>contact@gourmettable.com</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="footer-title">FOLLOW US</h4>
          <div className="footer-social">
            <a href="#instagram" className="social-icon"><FaInstagram /></a>
            <a href="#twitter" className="social-icon"><FaTwitter /></a>
            <a href="#facebook" className="social-icon"><FaFacebook /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 The Gourmet Table. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

