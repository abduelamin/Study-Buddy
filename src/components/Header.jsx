import React from "react";
import logo from "../assets/study-buddy-high-resolution-logo.png";
import "../styles/Header.css";

const Header = () => {
  return (
    <section className="header">
      <div>
        <img src={logo} alt="Study buddy Logo and title" className="logo" />
      </div>
    </section>
  );
};

export default Header;
