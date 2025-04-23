import { Link } from 'react-router-dom';

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
                <Link to="https://github.com/Aminesmaeili79/NASA-Project?tab=readme-ov-file#nasa-media-explorer">How Does It Work?</Link>
                <Link to="https://www.github.com/aminesmaeili79">About Me</Link>
            </div>
        </nav>
    );
};

export default Navbar;