// src/components/AddComment.js
import { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';

const notyf = new Notyf();

export default function AddComment({ movieId, onAddComment }) {
    const [comment, setComment] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Assuming you have a user ID stored in local storage
    const userId = localStorage.getItem('userId'); // Make sure to set this when the user logs in

    const handleAddComment = () => {
        setIsLoading(true); 
        fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addComment/${movieId}`, {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ comment })
        })
            .then(res => res.json())
            .then(data => {
                if (data.updatedMovie) {
                    notyf.success("Comment added successfully");
                    onAddComment({ comment, userId }); // Pass userId along with comment
                    setComment('');
                } else {
                    notyf.error("Failed to add comment");
                }
            })
            .catch(err => {
                console.error('Error adding comment:', err);
                notyf.error("Failed to add comment");
            })
            .finally(() => {
                setIsLoading(false); // Reset loading state
            });
    };

    useEffect(() => {
        setIsActive(comment.trim() !== '');
    }, [comment]);

    return (
        <Form className="mt-2">
            <Form.Group controlId="commentTextarea">
                <Form.Control 
                    as="textarea" 
                    rows={2} 
                    placeholder="Add a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    className="bg-secondary text-white"
                />
            </Form.Group>
            <Button 
                variant="primary"
                className="mt-2" 
                onClick={handleAddComment}
                disabled={!isActive || isLoading}
            >
                {isLoading ? (
                    <>
                        <Spinner animation="border" size="sm" /> Adding...
                    </>
                ) : (
                    "Add Comment"
                )}
            </Button>
        </Form>
    );
}
