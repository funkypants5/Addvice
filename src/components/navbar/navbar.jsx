import React, { useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      <div className="navbar-container">
        <button
          className="Nav-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Features
        </button>
        {isDropdownOpen && (
          <div className="dropdown">
            <a href="/chatApp" className="dropdown-item">
              Chat
            </a>
            <a href="/currentMentorMentees" className="dropdown-item">
              Connections
            </a>
            <a href="/Calendar" className="dropdown-item">
              Calendar
            </a>
            <a href="/discovery" className="dropdown-item">
              Discover
            </a>
            <a href="/profile" className="dropdown-item">
              Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
