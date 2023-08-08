import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navigation.css";
import splitziesFullPurpleImage from "../../assets/SPLITZIES_FULL_PURPLE.png";
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
    history.push("/login");
  };

  let sessionLinks;

  if (sessionUser) {
    sessionLinks = (
      <div className="logged-in-buttons">
        <div className="hello-text"> Hello {sessionUser.username} </div>
        <button className='menuLogOutButton' onClick={handleLogout}>Log Out</button>
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

  const navClassName = sessionUser ? "nav-bar-logged-in" : "nav-bar";

  return (
    <>
      <div className={navClassName}>
        <div>
          {sessionUser ? (
            <NavLink exact to="/dashboard">
              <img
                className="logged-in-logo-img"
                src={splitziesFullPurpleImage}
                alt="Splitzies Purple Logo"
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
            {isLoaded && sessionLinks}
          </div>
        )}
      </div>
    </>
  );
}

export default Navigation;
