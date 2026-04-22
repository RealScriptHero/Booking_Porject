import React, { useState } from 'react';
import Header from '../2-Home/Header';
import Footer from '../2-Home/Footer';
import MenuHeader from './MenuHeader';
import Appetizers from './Appetizeers';
import MainCourses from './MainCourses';
import Desserts from './Desserts';
import Drinks from './Drinks';
import Specials from './Specials';
import './Menu.css';

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="menu-page">
      <Header />
      <MenuHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Appetizers searchTerm={searchTerm} />
      <MainCourses searchTerm={searchTerm} />
      <Desserts searchTerm={searchTerm} />
      <Drinks searchTerm={searchTerm} />
      <Specials searchTerm={searchTerm} />
      <Footer />
    </div>
  );
}

