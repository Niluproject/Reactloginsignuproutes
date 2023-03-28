import React from 'react';
import './assets/css/local.css'
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    const item = localStorage.getItem('user');
    const auth = item !== '' && item !== null ? JSON.parse(item) : '';
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/register');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#">Demo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {auth._id ? (
                            <>
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                                <Link to="/contact" className="nav-link">
                                    About us
                                </Link>
                                <Link to="/login" onClick={logout} className="nav-link">
                                    Logout ({auth.name})
                                </Link>
                            </>
                        ) : (
                            <React.Fragment>
                                <Link to="/signup" className="nav-link nav-right" >
                                    Sign Up
                                </Link>
                                <Link to="/login" className="nav-link nav-right">
                                    Login
                                </Link>
                            </React.Fragment>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
