import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './Nav';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
const Routess = () => {
    return (
        <div>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/about" element={<Contact />} />
                    <Route exact path="/contact" element={<About />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/signup" element={<Signup />} />
                </Routes>

            </BrowserRouter>
        </div>
    )
}

export default Routess
