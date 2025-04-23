import Navbar from './Navbar';
import Footer from './Footer';

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