import React, { useState, useEffect } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, NavLink } from "react-router-dom";
import "./LoginForm.css";
import friendsImg from '../../assets/friends_fun.png'

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(username, password));
    if (data) {
      setErrors(data);
    } else {
      history.push("/dashboard");
    }
  };

  const demoUser = async (e) => {
    e.preventDefault();
    let username = "demo";
    let password = "password";
    const data = await dispatch(login(username, password));
    if (data) {
      setErrors(data);
    } else {
      history.push("/dashboard");
    }
  };

  const signupButton = (e) => {
    e.preventDefault();
    history.push("/signup");
  };

  return (
    <>
    <div className="login-container">
      <div className='login-form'>
      <h1 className="log-in-heading">Log In to Splitzies</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="inputContainer">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="inputContainer">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="log-in-buttons">
        <button type="submit">Log In</button>
        <button onClick={demoUser}>Log In as Demo User</button>
        </div>
        <div className="other-buttons">
        <div className="form-text">or create a new account</div>
        <button className="signUpButton"onClick={signupButton}>Sign Up</button>
        </div>
      </form>
      </div>
      <img
        className="login-img"
        src={friendsImg}
        alt="Friends Fun Image Illustration"
      />
      </div>
    </>
  );
}

export default LoginFormPage;
