import React, { useState } from 'react';
import "./navbar.css"

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
            <a href="/discovery" className="dropdown-item">
              Discover
            </a>
            <a href="/messagingpage" className="dropdown-item">
              Message
            </a>
            <a href="/currentMentorMentees" className="dropdown-item">
              Current Mentors/Mentees
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
