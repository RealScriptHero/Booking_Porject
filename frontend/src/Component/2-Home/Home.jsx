import React from 'react';
import Header from './Header';
import Hero from './Hero';
import BookingWidget from './BookingWidget';
import InformationSection from './InformationSection';
import Gallery from './Gallery';
import Testimonial from './Testimonial';
import Footer from './Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <BookingWidget />
      <InformationSection />
      <Gallery />
      <Testimonial />
      <Footer />
    </div>
  );
}
