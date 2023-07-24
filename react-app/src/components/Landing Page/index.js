import React, { useEffect, useRef } from 'react';
import "./LandingPage.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);


  const loginButton = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  const signupButton = (e) => {
    e.preventDefault();
    history.push("/signup");
  };

  useEffect (() => {
      const left = document.getElementById("left-side");
      
      const handleMove = (e) => {
        left.style.width = `${(e.clientX / window.innerWidth) * 100}%`;
      };
    
      document.onmousemove = (e) => handleMove(e);
    
      document.ontouchmove = (e) => handleMove(e.touches[0]);
  })

  const handleClick = (e) => {
    if (sessionUser) {
      e.preventDefault();
      history.push('/dashboard')
    } else {
      e.preventDefault();
      history.push('/login')
    }
  }

  return (
    <div onClick={handleClick} className='split-panel' >
      <div id="left-side" className="side">
        <h2 className="title">
          Splitting bills doesn't have to be hard.
          {/* <span class="fancy">better</span> */}
          <div className='fancy-hidden'>Go Splitzies.</div>
        </h2>
      </div>
      <div id="right-side" className="side">
        <h2 className="title">
        Splitting bills doesn't have to be hard.
        <div className='fancy'>Go Splitzies.</div>
        </h2>
      </div>
    </div>
  );
}
