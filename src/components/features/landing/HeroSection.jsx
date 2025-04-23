import img1 from '../../../assets/img-1.jpg';
import img2 from '../../../assets/img-2.webp';
import img3 from '../../../assets/img-3.jpg';
import img4 from '../../../assets/img-4.jpg';
import imgHero from '../../../assets/img-hero.png';
import img5 from '../../../assets/img-5.webp';
import img6 from '../../../assets/img-6.jpg';
import img7 from '../../../assets/img-7.png';
import img8 from '../../../assets/img-8.webp';

const HeroSection = () => {
    return (
        <>
            <div className="overlay">
                <div className="projects">
                    <div className="projects__header">
                        <p>Projects</p>
                        <p>By</p>
                    </div>
                </div>
                <div className="loader">
                    <h1 className="logo-line-1">NASA</h1>
                    <h1 className="logo-line-2">PROJECT</h1>
                </div>
                <div className="locations">
                    <div className="locations__header">
                        <p>Locations</p>
                    </div>
                </div>
            </div>

            <div className="image-grid">
                <div className="grid-row">
                    <div className="img"><img src={img1} alt="NASA image 1" /></div>
                    <div className="img"><img src={img2} alt="NASA image 2" /></div>
                    <div className="img"><img src={img3} alt="NASA image 3" /></div>
                </div>
                <div className="grid-row">
                    <div className="img"><img src={img4} alt="NASA image 4" /></div>
                    <div className="img hero-img"><img src={imgHero} alt="NASA hero image" /></div>
                    <div className="img"><img src={img5} alt="NASA image 5" /></div>
                </div>
                <div className="grid-row">
                    <div className="img"><img src={img6} alt="NASA image 6" /></div>
                    <div className="img"><img src={img7} alt="NASA image 7" /></div>
                    <div className="img"><img src={img8} alt="NASA image 8" /></div>
                </div>
            </div>
        </>
    );
};

export default HeroSection;

