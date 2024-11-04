// src/components/AppNavbar.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import '../App.css';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar className="extreme-navbar" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="extreme-brand sparkle">
                    Movie Rental
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/" exact className="extreme-link">Home</Nav.Link>

                        {localStorage.getItem('token') ? (
                            <>
                                <Nav.Link as={NavLink} to="/movies" exact className="extreme-link">My Movies</Nav.Link>

                                {/* Only show "Add Movie" link and "Admin Dashboard" link if user is an admin */}
                                {user.isAdmin && (
                                    <NavDropdown title="Admin" id="admin-dropdown" className="extreme-link">
                                        <NavDropdown.Item as={NavLink} to="/addMovie">Add Movie</NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/admin-dashboard">Admin Dashboard</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                                
                                <Nav.Link as={Link} to="/logout" className="extreme-link">Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="extreme-link">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" className="extreme-link">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
