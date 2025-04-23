// src/components/features/landing/IntroSection.jsx
import React from 'react';
import img9 from '../../../assets/img-11.jpg';
import img10 from '../../../assets/img-12.webp';

const IntroSection = () => {
    return (
        <>
            <div className="banner-image banner-image-1">
                <img src={img9} alt="NASA banner 1" />
            </div>
            <div className="banner-image banner-image-2">
                <img src={img10} alt="NASA banner 2" />
            </div>

            <div className="intro-copy text-large">
                <h3>Creative Scientists</h3>
                <h3>Build The Future</h3>
            </div>

            <div className="title">
                <h1>
                    <a href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer">
                        Find Out More About NASA
                    </a>
                </h1>
            </div>
        </>
    );
};

export default IntroSection;