import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


const Navbar = () => {
    return (
    <nav>
        <div className="links">
            <Link to="/NASA-Project/search">Search</Link>
            <Link to="">API Docs</Link>
        </div>
        <div className="nav-logo">
            <a href="/">NASA<br />PROJECT</a>
        </div>
        <div className="links">
            <Link to="#">How Does It Work?</Link>
            <Link to="#">About Me</Link>
        </div>
    </nav>
    )
}
export default Navbar
