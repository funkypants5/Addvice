import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="Register">
        <div className="">
          <div className="">
            <div className="">
              <h3 className="">Create a New Account</h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="">Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className=""
              />
            </div>

            <div>
              <label className="">Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                required={true}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className=""
              />
            </div>

            <div>
              <label className="">Confirm Password</label>
              <input
                disabled={isRegistering}
                type="password"
                autoComplete="off"
                required={true}
                value={confirmPassword}
                placeholder="Password"
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                }}
                className=""
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}
            <div className="text-center">
              <button
                type="submit"
                disabled={isRegistering}
                className={`secondary-button ${
                  isRegistering
                    ? "bg-gray-300 cursor-not-allowed"
                    : "secondary-button:hover"
                }`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
            <div className="text-sm text-center">
              Already have an account? {"   "}
              <Link to={"/login"} className="">
                Continue
              </Link>
            </div>
          </form>
          <h2> FIND THE ONE FOR YOU</h2>
        </div>
      </main>
    </>
  );
};

export default Register;
