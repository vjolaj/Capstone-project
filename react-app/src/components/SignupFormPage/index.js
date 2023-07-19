import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  
  useEffect(() => {
    const errors = [];
    if (username.length === 0) errors.username = "";
    if (email.length === 0) errors.email = "";
    if (firstName.length === 0) errors.firstName = "";
    if (lastName.length === 0) errors.lastName = "";
    if (password.length === 0 || password.length < 6) errors.password = "";
    if (confirmPassword.length === 0 || confirmPassword.length < 6)
    errors.confirmPassword = "";
    if (username.length < 4 && username.length > 0)
    errors.username = "Username needs to be at least 4 characters.";
    if (password.length < 6 && password.length > 0)
    errors.password = "Password needs to be at least 6 characters.";
    
    setErrors(errors);
  }, [email, firstName, lastName, username, password, confirmPassword]);
  
  if (sessionUser) return <Redirect to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(
        signUp(username, email, password, firstName, lastName)
      );
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <p>Join Splitzies Today</p>
        {errors.firstName && <p className="signError">{errors.firstName}</p>}
        {errors.lastName && <p className="signError">{errors.lastName}</p>}
        {errors.username && <p className="signError">{errors.username}</p>}
        {errors.email && <p className="signError">{errors.email}</p>}
        {errors.password && <p className="signError">{errors.password}</p>}
        {errors.confirmPassword && (
          <p className="signError">{errors.confirmPassword}</p>
        )}
        <label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
            className="input"
          />
        </label>
        <label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
            className="input"
          />
        </label>
        <label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;
