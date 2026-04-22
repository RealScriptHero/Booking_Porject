import React from 'react';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { FaUtensils, FaAward, FaUsers, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './AboutUs.css';

export default function AboutUs() {
  return (
    <div className="about-us-page">
      <Header />
      
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About The Gourmet Table</h1>
          <p className="about-hero-subtitle">
            Crafting memorable dining experiences since 2000
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-content-wrapper">
            <div className="about-text-content">
              <h2 className="section-title">Our Story</h2>
              <p className="section-text">
                Founded in 2000, The Gourmet Table has been a cornerstone of fine dining in Foodie City. 
                Our journey began with a simple yet profound vision: to create a dining experience that 
                transcends the ordinary, where every dish tells a story and every meal becomes a memory.
              </p>
              <p className="section-text">
                Over two decades, we have perfected the art of blending traditional culinary techniques 
                with modern innovation. Our commitment to using only the finest, locally-sourced ingredients 
                ensures that each plate not only delights the palate but also supports our community and 
                sustainable practices.
              </p>
              <p className="section-text">
                Today, The Gourmet Table stands as a testament to culinary excellence, where passion meets 
                precision, and every guest is treated as family. Join us in celebrating the art of fine dining.
              </p>
            </div>
            <div className="about-image-container">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                alt="Restaurant interior"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-section values-section">
        <div className="about-container">
          <h2 className="section-title center-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FaUtensils className="value-icon" />
              <h3 className="value-title">Culinary Excellence</h3>
              <p className="value-text">
                We are committed to serving dishes that exceed expectations, crafted by our talented chefs 
                with the finest ingredients.
              </p>
            </div>
            <div className="value-card">
              <FaAward className="value-icon" />
              <h3 className="value-title">Award-Winning Service</h3>
              <p className="value-text">
                Our dedicated team ensures every guest receives personalized attention and impeccable service 
                from the moment they arrive.
              </p>
            </div>
            <div className="value-card">
              <FaUsers className="value-icon" />
              <h3 className="value-title">Community First</h3>
              <p className="value-text">
                We source locally, support our community, and create a welcoming space where everyone 
                feels at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="about-section team-section">
        <div className="about-container">
          <h2 className="section-title center-title">Meet Our Chef</h2>
          <div className="chef-section">
            <div className="chef-image-container">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop"
                alt="Head Chef"
                className="chef-image"
              />
            </div>
            <div className="chef-content">
              <h3 className="chef-name">Chef HOUDA ABIDA</h3>
              <p className="chef-title">Executive Chef & Co-Founder</p>
              <p className="chef-description">
                With over 25 years of culinary experience, Chef Houda brings passion, innovation, and 
                authenticity to every dish. Trained in Europe's finest kitchens, she combines traditional 
                techniques with contemporary flair, creating a menu that honors the past while embracing 
                the future.
              </p>
              <p className="chef-description">
                Her philosophy is simple: food should be a celebration. Each ingredient is carefully selected, 
                each technique is perfected, and each plate is presented as a work of art. Under her guidance, 
                The Gourmet Table has earned multiple culinary awards and recognition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Photos Gallery */}
      <section className="about-section gallery-section">
        <div className="about-container">
          <h2 className="section-title center-title">Our Restaurant</h2>
          <div className="restaurant-gallery">
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop"
                alt="Restaurant dining area"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop"
                alt="Restaurant bar area"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
                alt="Chef preparing food"
                className="gallery-image"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"
                alt="Elegant table setting"
                className="gallery-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="about-section contact-section">
        <div className="about-container">
          <h2 className="section-title center-title">Visit Us</h2>
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-details">
                <h4 className="contact-label">Address</h4>
                <p className="contact-value">123 Culinary Lane<br />Foodie City, 90210</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaPhone className="contact-icon" />
              <div className="contact-details">
                <h4 className="contact-label">Phone</h4>
                <p className="contact-value">(123) 456-7890</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-details">
                <h4 className="contact-label">Email</h4>
                <p className="contact-value">contact@gourmettable.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaClock className="contact-icon" />
              <div className="contact-details">
                <h4 className="contact-label">Hours</h4>
                <p className="contact-value">
                  Mon - Fri: 12pm - 10pm<br />
                  Sat - Sun: 11am - 11pm
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

