import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Toggle menu
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            {/* Logo always visible */}
            <div className="nav-logo">
                <Link to="/">NASA<br />PROJECT</Link>
            </div>

            {/* Hamburger icon for mobile */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
                <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
                <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
            </div>

            {/* Navigation links - show based on screen size or menu state */}
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/search" onClick={() => setMenuOpen(false)}>Search</Link>
                <a href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={() => setMenuOpen(false)}>
                    API Docs
                </a>
                <a href="https://github.com/Aminesmaeili79/NASA-Project?tab=readme-ov-file#nasa-media-explorer"
                   onClick={() => setMenuOpen(false)}>
                    How Does It Work?
                </a>
                <a href="https://www.github.com/aminesmaeili79"
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={() => setMenuOpen(false)}>
                    About Me
                </a>
            </div>
        </nav>
    );
};

export default Navbar;