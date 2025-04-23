import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Main page layout component that includes navbar and footer
 */
const PageLayout = ({ children, withFooter = true }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-20">
                {children}
            </main>

            {withFooter && <Footer />}
        </div>
    );
};

export default PageLayout;