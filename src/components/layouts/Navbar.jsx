import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navigation bar component that matches the original styling
 */
const Navbar = () => {
    return (
        <nav>
            <div className="links">
                <Link to="/NASA-Project/search">Search</Link>
                <a href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
                   target="_blank"
                   rel="noopener noreferrer">
                    API Docs
                </a>
            </div>
            <div className="nav-logo">
                <Link to="/NASA-Project/">NASA<br />PROJECT</Link>
            </div>
            <div className="links">
                <Link to="#">How Does It Work?</Link>
                <Link to="#">About Me</Link>
            </div>
        </nav>
    );
};

export default Navbar;