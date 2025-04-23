import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <div className="links">
                <Link to="/search">Search</Link>
                <a href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
                   target="_blank"
                   rel="noopener noreferrer">
                    API Docs
                </a>
            </div>
            <div className="nav-logo">
                <Link to="/">NASA<br />PROJECT</Link>
            </div>
            <div className="links">
                <a href="https://github.com/Aminesmaeili79/NASA-Project?tab=readme-ov-file#nasa-media-explorer">How Does It Work?</a>
                <a href="https://www.github.com/aminesmaeili79"
                   target="_blank"
                   rel="noopener noreferrer">
                    About Me
                </a>
            </div>
        </nav>
    );
};

export default Navbar;