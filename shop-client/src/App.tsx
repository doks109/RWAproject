import React from 'react';
import './components/style/App.css';
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ResponsiveAppBar from "./components/Navigation";
import Posts from "./components/Posts";
import AboutUs from "./components/AboutUs";
import AddPost from "./components/AddPost";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ShoppingCart from "./components/ShoppingCart";
import Action from "./components/Action";



function App() {
  return (
          <>
              <div className="page-container">
                  <div className="content-wrap">
                      <ResponsiveAppBar/>
                      <Routes>
                          <Route path="/" element={ <Homepage/> } />
                          <Route path="/about" element={ <AboutUs/> } />
                          <Route path="/ponuda" element={ <Posts/> } />
                          <Route path="/addPost" element={ <AddPost/> } />
                          <Route path="/akcija" element={ <Action/> } />
                          <Route path="/register" element={ <Register/> } />
                          <Route path="/login" element={<Login />} />
                          <Route path="/cart" element={<ShoppingCart />} />
                      </Routes>
                  </div>
                  <Footer />
              </div>
          </>
  );
}

export default App;
