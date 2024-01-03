import React from 'react';
import './components/style/App.css';
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ResponsiveAppBar from "./components/Navigation";

function App() {
  return (
      <>
            <div className="page-container">
            <div className="content-wrap">
                <ResponsiveAppBar/>
            <Routes>
              <Route path="/" element={ <Homepage/> } />
              {/* <Route path="/test" element={ <Test/> } /> */}
            </Routes>
            </div>
            <Footer />
            </div>
      </>
  );
}

export default App;
