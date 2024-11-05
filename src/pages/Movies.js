// src/pages/Movies.js
import { useState, useEffect, useContext } from 'react';
import { Form, Button, ListGroup, Container, Row, Col, Modal } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import MovieDetails from '../components/MovieDetails'; // Ensure this component is available
import AdminView from '../components/AdminView';
import { Notyf } from 'notyf';
import '../App.css';

export default function Movies() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [movies, setMovies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Fetch active movies
    const fetchMovies = () => {
        const fetchURL = `${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`;
        fetch(fetchURL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setMovies(data.movies || []);
            })
            .catch(err => console.error("Failed to fetch movies:", err));
    };

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
    }, [user]);

    const handleSearchByTitle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/search-by-title`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: movieTitle })
            });
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data);
            } else {
                console.error('Error searching for movies:', data.message);
            }
        } catch (error) {
            console.error('Error searching for movies by title:', error);
        }
    };

    const handleClear = () => {
        setMovieTitle('');
        setSearchResults([]);
    };

    // Modal functions
    const handleShowModal = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    return (
        <Container>
            <div>
                {user !== null && user.isAdmin ? (
                    <AdminView moviesData={movies} fetchData={fetchMovies} />
                ) : (
                    <>
                        <h1 className="text-center">Movie Search</h1>
                        <Form>
                            <Form.Group controlId="movieTitle">
                                <Form.Label>Movie Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={movieTitle}
                                    onChange={(e) => setMovieTitle(e.target.value)}
                                    placeholder="Enter movie title"
                                />
                            </Form.Group>
                            <Button onClick={handleSearchByTitle} className="mt-3 me-2">
                                Search by Title
                            </Button>
                            <Button onClick={handleClear} className="mt-3">
                                Clear
                            </Button>
                        </Form>

                        <h1 className="mt-4 text-center">Search Results</h1>
                        {searchResults.length > 0 ? (
                            <ListGroup>
                                {searchResults.map((movie) => (
                                    <ListGroup.Item key={movie._id}>
                                        <h5>{movie.title}</h5>
                                        <p>Director: {movie.director}</p>
                                        <p>Year: {movie.year}</p>
                                        <p>Genre: {movie.genre}</p>
                                        <p>Description: {movie.description}</p>
                                        <Button variant="primary" onClick={() => handleShowModal(movie)}>
                                            Details
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No movies found.</p>
                        )}

                        <Row>
                            <Col xs={12} className="mb-4 text-center">
                                <h1>My Movies</h1>
                            </Col>
                        </Row>
                        <UserView moviesData={movies} />

                        {/* Modal for Movie Details */}
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedMovie?.title}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedMovie && <MovieDetails movie={selectedMovie} />}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                )}
            </div>
        </Container>
    );
}
