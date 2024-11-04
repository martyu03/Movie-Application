// components/MovieCard.js
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MovieCard({ movieProp }) {
    if (!movieProp) {
        return <div>No movie data available</div>; 
    }

    console.log('Movie data:', movieProp);

    const { title, director, year, genre, description, comment, _id } = movieProp;

    return (
        <Card>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle>Director:</Card.Subtitle>
                <Card.Text>{director}</Card.Text>
                <Card.Subtitle>Year:</Card.Subtitle>
                <Card.Text>{year}</Card.Text>
                <Card.Subtitle>Genre:</Card.Subtitle>
                <Card.Text>{genre}</Card.Text>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Text>{comment}</Card.Text>
                <Link className="btn btn-primary" to={`/movies/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    );
}
