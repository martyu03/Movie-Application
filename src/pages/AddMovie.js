// pages/AddMovie.js
import { useState, useEffect, useContext } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function AddMovie() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (title && director && description && year && genre) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [title, director, description, year, genre]);

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
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
        })
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data);  // Log the entire response for debugging
            if (data.success) {  // Check the success property
                notyf.success('Movie Added');
                // Reset fields
                setTitle('');
                setDirector('');
                setDescription('');
                setYear('');
                setGenre('');
                setRedirect(true);
            } else {
                notyf.error(data.message || 'Unsuccessful Movie Creation');
            }
        })
        .catch(err => {
            console.error('Error adding movie:', err);
            notyf.error('Failed to add movie due to an error');
        });
    }

    if (redirect) {
        return <Navigate to="/movies" />;
    }

    return (
        <Container className="my-4">
            <Row>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2 className="text-center mb-4">Add Movie</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter movie title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Director</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter director's name"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter movie description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter release year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="text-center mt-4">
                            <Button variant="primary" type="submit" disabled={!isActive}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
