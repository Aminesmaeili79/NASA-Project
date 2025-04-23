import './App.css'
import Landing from "./components/sections/Landing.jsx";
import Navbar from "./components/elements/Navbar.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Search from "./components/sections/Search.jsx";
import Article from "./components/sections/Article.jsx";
import { AnimationProvider } from "./data/AnimationContext.jsx";
import { ArticleProvider } from "./data/ArticleContext.jsx";

function App() {
    return (
        <>
            <AnimationProvider>
                <ArticleProvider>
                    <BrowserRouter>
                        <Navbar />
                        <Routes>
                            <Route path="/NASA-Project" element={<Landing />} />
                            <Route path="/NASA-Project/search" element={<Search />} />
                            <Route path="/NASA-Project/search/:title" element={<Article />} />
                        </Routes>
                    </BrowserRouter>
                </ArticleProvider>
            </AnimationProvider>
        </>
    )
}

export default App