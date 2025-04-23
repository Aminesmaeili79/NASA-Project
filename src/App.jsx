import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            <Route path="/NASA-Project" element={<LandingPage />} />
                            <Route path="/NASA-Project/search" element={<SearchPage />} />
                            <Route path="/NASA-Project/search/:title" element={<ArticlePage />} />
                        </Routes>
                    </BrowserRouter>
                </ArticleProvider>
            </AnimationProvider>
        </>
    );
}

export default App;