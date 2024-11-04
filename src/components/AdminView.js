// src/components/AdminView.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';

const AdminView = ({ moviesData, fetchData }) => {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state
    const notyf = new Notyf();

    useEffect(() => {
        // Check local storage for the admin token on component mount
        const token = localStorage.getItem('token');
        // Set admin status based on token presence
        setIsAdmin(!!token);
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        // This will evaluate isActive based on form fields
        setIsActive(title && director && description && year && genre);
    }, [title, director, description, year, genre]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    director,
                    description,
                    year,
                    genre
                })
            });

            const data = await response.json();
            if (data) {
                notyf.success('Movie Added');
                // Clear form fields
                setTitle('');
                setDirector('');
                setDescription('');
                setYear('');
                setGenre('');
                // Fetch the updated movies list after successfully adding a movie
                await fetchData(); 
                setShowModal(false);
            } else {
                notyf.error('Failed to add movie');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
            notyf.error('Failed to add movie');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Movie deleted successfully') {
                    notyf.success('Movie Deleted');
                    fetchData(); // Refresh the movies list
                } else {
                    notyf.error('Failed to delete movie');
                }
            })
            .catch(err => {
                notyf.error('Error deleting movie');
                console.error(err);
            });
        }
    };

    // If the user is not an admin, display a message
    if (!isAdmin) {
        return <h2 className="text-center my-5">Access Denied. You must be an admin to view this page.</h2>;
    }

    return (
        <div>
            <h1 className="text-center my-5">Admin Dashboard</h1>
            <div className='text-center'>
                <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                    Add Movie
                </Button>
            </div>

            {/* Modal for adding a movie */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter director"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="text-center mt-3">
                            <Button variant="primary" type="submit" disabled={!isActive}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Display movies in cards */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {Array.isArray(moviesData) && moviesData.map((movie) => (
                    <Col key={movie._id}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{movie.director}</Card.Subtitle>
                                <Card.Text>
                                    <strong>Description:</strong> {movie.description}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Year:</strong> {movie.year} <br />
                                    <strong>Genre:</strong> {movie.genre}
                                </Card.Text>
                                <Button variant="danger" onClick={() => handleDelete(movie._id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminView;
