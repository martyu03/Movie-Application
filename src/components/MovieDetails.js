// src/components/MovieDetails.js
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Loading from '../components/Loading';
import AddComment from './AddComment';
import '../App.css'; // Ensure to import your custom styles

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch the movie by ID
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getmovie/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data.comments);
            })
            .catch(err => console.error('Error fetching comments:', err));
    }, [id, token]);

    const handleAddComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    const formatUserId = (userId) => {
        return userId && userId.length > 6 ? `${userId.slice(0, 10)}...` : userId;
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
                    <h5 className='mt-3 fw-bold comments-title'>Comments</h5> {/* Updated to use CSS class */}
                    <AddComment id="addComment" movieId={id} onAddComment={handleAddComment} />
                    <div className="mt-3 pb-3">
                        {comments.length > 0 ? (
                            comments.slice().reverse().map((comment, index) => (
                                <Card key={index} className="mt-2 custom-detail-card">
                                    <Card.Body>
                                        <Card.Subtitle className='fw-semibold'>
                                            {formatUserId(comment.userId)}
                                        </Card.Subtitle>
                                        <Card.Text className="comment-text" style={{ color: 'black' }}>{comment.comment}</Card.Text>
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
