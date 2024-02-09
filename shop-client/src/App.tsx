import React from 'react';
import './components/style/App.css';
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ResponsiveAppBar from "./components/Navigation";
import Posts from "./components/Posts";
import AboutUs from "./components/Posts";

function App() {
  return (
      <>
            <div className="page-container">
            <div className="content-wrap">
                <ResponsiveAppBar/>
            <Routes>
                <Route path="/" element={ <Homepage/> } />
                {/* <Route path="/test" element={ <Test/> } /> */}
                <Route path="/about" element={ <AboutUs/> } />
                <Route path="/ponuda" element={ <Posts/> } />
            </Routes>
            </div>
            <Footer />
            </div>
      </>
  );
}

export default App;
