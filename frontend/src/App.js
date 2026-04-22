import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Component/1-Login/Login';
import Sign from "./Component/1-Login/Sign-up";
import Home from "./Component/2-Home/Home";
import Menu from "./Component/6-Menu/Menu";
import BookYourTable from "./Component/5-Booking-table/BookYourTable";
import BookingDetails from "./Component/5-Booking-table/BookingDetails";
import Confirmation from "./Component/5-Booking-table/Confirmation";
import Reservations from "./Component/3-Booking/Reservations";
import AboutUs from "./Component/4-Contact/AboutUs";
import Contact from "./Component/4-Contact/Contact";
import MenuManagement from "./Component/Admin/MenuManagement";
import AdminReservations from "./Component/Admin/AdminReservations";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
         <Route path='/' element={<Login  />}/>
          <Route path="/Sign-up" element={<Sign/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/2-Home/Home.jsx" element={<Home/>} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/reservations" element={<Reservations/>} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/booking" element={<BookYourTable/>} />
          <Route path="/booking/details" element={<BookingDetails/>} />
          <Route path="/booking/confirmation" element={<Confirmation/>} />
          <Route path="/admin/menu" element={<MenuManagement/>} />
          <Route path="/admin/reservations" element={<AdminReservations/>} />
       
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
