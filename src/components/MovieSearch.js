// components/MovieSearch.js
import React, { useState } from 'react';
import MovieCard from './MovieCard'; 

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:4007/b7/movies/search', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieName: searchQuery }) 
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for movies:', error); 
    }
  };

  return (
    <div>
      <h2>Movie Search</h2> {/* Updated title */}
      <div className="form-group">
        <label htmlFor="movieName">Movie Name:</label> 
        <input
          type="text"
          id="movieName" 
          className="form-control"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-2" onClick={handleSearch}>
        Search
      </button>
      <h3 className="mt-3">Search Results:</h3>
      <ul>
        {searchResults.map(movie => ( // Updated mapping
          <MovieCard movieProp={movie} key={movie._id} /> 
        ))}
      </ul>
    </div>
  );
};

export default MovieSearch;
