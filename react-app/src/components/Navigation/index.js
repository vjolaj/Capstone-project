import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import splitziesFullOrangeImage from "../../assets/SPLITZIES_FULL_ORANGE.png";
import splitziesFullGreenImage from "../../assets/SPLITZIES_Full.png";
import splitziesFullBlueImage from '../../assets/Splitzies_Full_Blue.png'
import { logout } from "../../store/session";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const loginButton = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  const signupButton = (e) => {
    e.preventDefault();
    history.push("/signup");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push("/");
  };
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="logged-in-buttons">
        <div> Hello {sessionUser.username} </div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="logged-out-buttons">
        <button onClick={signupButton} className="menuSignUpButton">
          Sign Up
        </button>
        <button onClick={loginButton} className="menuLoginButton">
          Log in
        </button>
      </div>
    );
  }
  return (
    <>
      <div className="nav-bar">
        <div>
          {sessionUser ? (
            <NavLink exact to="/dashboard">
              <img
                className="logo-img"
                src={splitziesFullGreenImage}
                alt="Splitzies Green Logo"
              />
            </NavLink>
          ) : (
            <NavLink exact to="/">
              <img
                className="logo-img"
                src={splitziesFullBlueImage}
                alt="Splitzies Blue Logo"
              />
            </NavLink>
          )}
        </div>
        {isLoaded && (
          <div>
            {/* <ProfileButton user={sessionUser} /> */}
            {isLoaded && sessionLinks}
          </div>
        )}
      </div>
    </>
  );
}

export default Navigation;
