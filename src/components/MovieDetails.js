// src/components/MovieDetails.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddComment from './AddComment';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);

    // Get the token from local storage
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch the movie by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getmovie/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token here
            }
        })
            .then(res => res.json())
            .then(data => {
                setMovie(data);
            })
            .catch(err => console.error('Error fetching movie:', err));

        // Fetch comments for the movie
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getcomments/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token here
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data.comments);
            })
            .catch(err => console.error('Error fetching comments:', err));
    }, [id, token]); // Add token as a dependency to useEffect

    const handleAddComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    // Function to format userId for display
    const formatUserId = (userId) => {
        if (userId && userId.length > 6) {
            return `${userId.slice(0, 10)}...`; // Show first 10 characters and ellipsis
        }
        return userId;
    };

    return (
        <div className="movie-details mx-auto" style={{ maxWidth: '900px' }}>
            {movie ? (
                <div className='pt-4'>
                    <Card className='custom-detail-card' style={{ minHeight: '200px' }}>
                        <Card.Body>
                            <Card.Title>{movie.title}</Card.Title>
                            <Card.Subtitle>Director: {movie.director}</Card.Subtitle>
                            <Card.Text>Year: {movie.year}</Card.Text>
                            <Card.Text>Genre: {movie.genre}</Card.Text>
                            <Card.Subtitle>Description: </Card.Subtitle>
                            <Card.Text>{movie.description}</Card.Text>
                        </Card.Body>
                    </Card>
                    <h5 className='text-light mt-3 fw-bold'>Comments</h5>
                    <AddComment id="addComment" movieId={id} onAddComment={handleAddComment} />
                    <div className="mt-3 pb-3">
                        {comments.length > 0 ? (
                            comments.slice().reverse().map((comment, index) => (
                                <Card key={index} className="mt-2 custom-detail-card">
                                    <Card.Body>
                                        <Card.Subtitle className='fw-semibold'>
                                            {formatUserId(comment.userId)}
                                        </Card.Subtitle>
                                        <Card.Text>{comment.comment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className='text-light'>No comments yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </div>
    );
}
