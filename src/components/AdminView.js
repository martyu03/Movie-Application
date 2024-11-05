// src/components/AdminView.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';

const AdminView = ({ moviesData, fetchData }) => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false); // State for update modal
    const [currentMovie, setCurrentMovie] = useState(null); // State for the movie being updated
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const notyf = new Notyf();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAdmin(!!token);
    }, []);

    useEffect(() => {
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
                clearForm();
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

    const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedMovieData = { /* your updated movie data */ };
    
    try {
        const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${currentMovie._id}`, {
            method: 'PATCH', // Change this from PUT to PATCH
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust according to your auth method
            },
            body: JSON.stringify(updatedMovieData),
        });
        
        if (!response.ok) {
            throw new Error('Error updating movie');
        }
        
        const data = await response.json();
        // handle success
    } catch (error) {
        console.error('Error updating movie:', error);
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

    const openUpdateModal = (movie) => {
        setCurrentMovie(movie);
        setTitle(movie.title);
        setDirector(movie.director);
        setDescription(movie.description);
        setYear(movie.year);
        setGenre(movie.genre);
        setShowUpdateModal(true);
    };

    const clearForm = () => {
        setTitle('');
        setDirector('');
        setDescription('');
        setYear('');
        setGenre('');
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

            {/* Modal for updating a movie */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
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
                                Update
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
                                <Card.Text>{movie.description}</Card.Text>
                                <Card.Text><strong>Year:</strong> {movie.year}</Card.Text>
                                <Card.Text><strong>Genre:</strong> {movie.genre}</Card.Text>
                                <Button variant="warning" onClick={() => openUpdateModal(movie)}>Edit</Button>
                                <Button variant="danger" className="ms-2" onClick={() => handleDelete(movie._id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminView;
