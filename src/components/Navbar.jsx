import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);



  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        
        <span className="logo">ARCHI-REFLEX</span>



        <span className="logo">Bienvenue</span>



      </div>

    </nav>
  );
}
