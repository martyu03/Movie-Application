// src/components/UserView.js
import React from 'react';
import MovieCard from './MovieCard';
import MovieSearch from './MovieSearch';
import { Row } from 'react-bootstrap';

const UserView = ({ moviesData }) => {
    return (
        <>
            {moviesData.map(movie => (
                <MovieCard key={movie._id} movieProp={movie} />
            ))}
        </>
    );
}

export default UserView;
