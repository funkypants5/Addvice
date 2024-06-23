import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import Logo1 from "../../components/images/Logo1.png";
import Logo2 from "../../components/images/Logo2.png";
import Logo3 from "../../components/images/Testpic.png";

const Header = () => {
  const navigate = useNavigate();
  const minimal = true;
  const { userLoggedIn } = useAuth();
  return (
    <nav className="logo-container">
      <img className="logo" src={minimal ? Logo3 : Logo2} alt="Logo" />
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
