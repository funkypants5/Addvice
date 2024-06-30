import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../lib/auth";
import Logo2 from "../../components/images/Logo2.png";
import Logo3 from "../../components/images/Testpic.png";
import "./header.css"

const Header = () => {
  const navigate = useNavigate();
  const minimal = true;
  const { userLoggedIn } = useAuth();
  return (
    <nav className="header-container">
      <img className="logo" src={minimal ? Logo3 : Logo2} alt="Logo" />
      <p className="primary-title">Share your Experience</p>
      {userLoggedIn ? (
        <>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="nav-button"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button className="nav-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </>
      )}
    </nav>
  );
};

export default Header;
