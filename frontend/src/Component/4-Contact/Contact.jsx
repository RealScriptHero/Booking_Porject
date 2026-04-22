import React, { useState } from 'react';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      fullName: '',
      emailAddress: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-description">
            We'd love to hear from you. Please fill out the form below or use our contact details to reach us. 
            Our team is ready to assist you with any inquiries or reservations.
          </p>
        </div>

        <div className="contact-content">
          {/* Left Column - Contact Information */}
          <div className="contact-info-card">
            <h2 className="contact-card-title">Contact Information</h2>
            
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-info-details">
                <p className="contact-info-text">123 Culinary Lane, Foodie City, 54321</p>
                <span className="contact-info-label">Address</span>
              </div>
              <a href="https://maps.google.com" className="contact-link" target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </div>

            <div className="contact-divider"></div>

            <div className="contact-info-item">
              <FaPhone className="contact-icon" />
              <div className="contact-info-details">
                <p className="contact-info-text">(123) 456-7890</p>
                <span className="contact-info-label">Phone</span>
              </div>
              <a href="tel:+1234567890" className="contact-link">
                Call Us
              </a>
            </div>

            <div className="contact-divider"></div>

            <div className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-info-details">
                <p className="contact-info-text">contact@gourmettable.com</p>
                <span className="contact-info-label">Email</span>
              </div>
              <a href="mailto:contact@gourmettable.com" className="contact-link">
                Email Us
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-card">
            <h2 className="contact-card-title">Send us a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-input"
                  placeholder="Reservation Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Your message here..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

