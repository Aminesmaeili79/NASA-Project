import './App.css'
import Landing from "./components/sections/Landing.jsx";
import Navbar from "./components/elements/Navbar.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Search from "./components/sections/Search.jsx";
import { AnimationProvider } from "./data/AnimationContext.jsx";

function App() {
  return (
      <>
          <AnimationProvider>
          <BrowserRouter>
              <Navbar />
              <Routes>
                  <Route path="/NASA-Project" element={<Landing />} />
                  <Route path="/NASA-Project/search" element={<Search />} />
              </Routes>
          </BrowserRouter>
          </AnimationProvider>
      </>
  )
}

export default App
