import React from "react";
import './Footer.css'

function Footer({isLoaded}) {
    return (
        <div id='footer-wrapper'>
            <div id='footer-content'>
                <div className="dev-info">
                    <div>Developer: Vjola Jorgji</div>
                    <a href="https://github.com/vjolaj" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i></a>
                    <a href='https://www.linkedin.com/in/vjola-jorgji-68a46b253/' target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin"></i></a>
                </div>
            </div>
        </div>
    )
}


export default Footer;