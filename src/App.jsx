import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ArticlePage from './pages/ArticlePage';
import { AnimationProvider } from './context/AnimationContext';
import { ArticleProvider } from './context/ArticleContext';

function App() {
    return (
        <>
            <AnimationProvider>
                <ArticleProvider>
                    <HashRouter>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/search/:title" element={<ArticlePage />} />
                        </Routes>
                    </HashRouter>
                </ArticleProvider>
            </AnimationProvider>
        </>
    );
}

export default App;