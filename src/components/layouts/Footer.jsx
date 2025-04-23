import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black/50 backdrop-blur-sm py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">NASA Project</h3>
                        <p className="text-gray-400">
                            Explore NASA's media library including images, audio, and video of space exploration,
                            astronauts, and other cosmic wonders.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/NASA-Project" className="text-gray-400 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/NASA-Project/search" className="text-gray-400 hover:text-white">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://www.nasa.gov/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                >
                                    NASA Official Website
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://images.nasa.gov/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                >
                                    NASA Image and Video Library
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">NASA API</h3>
                        <p className="text-gray-400 mb-2">
                            This project uses the official NASA Image and Video Library API.
                        </p>
                        <a
                            href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            API Documentation
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {currentYear} NASA Project. Not affiliated with NASA. All NASA content is in the public domain.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

