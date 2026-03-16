import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  const [movieId, setMovieId]           = useState('');
  const [actorFilter, setActorFilter]   = useState('');
  const [movieRoles, setMovieRoles]     = useState<any>(null);
  const [movieError, setMovieError]     = useState('');

  const [actorId, setActorId]           = useState('');
  const [movieFilter, setMovieFilter]   = useState('');
  const [actorBio, setActorBio]         = useState<any>(null);
  const [actorError, setActorError]     = useState('');

  const fetchMovieRoles = async () => {
    setMovieError('');
    setMovieRoles(null);
    try {
      const url = actorFilter
        ? `${API_BASE_URL}/movies/${movieId}/role?actor=${actorFilter}`
        : `${API_BASE_URL}/movies/${movieId}/role`;
      const res = await axios.get(url);
      setMovieRoles(res.data);
    } catch (err: any) {
      setMovieError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const fetchActorBio = async () => {
    setActorError('');
    setActorBio(null);
    try {
      const url = movieFilter
        ? `${API_BASE_URL}/actors/${actorId}?movie=${movieFilter}`
        : `${API_BASE_URL}/actors/${actorId}`;
      const res = await axios.get(url);
      setActorBio(res.data);
    } catch (err: any) {
      setActorError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="App">
      <h1>Movie Cast App</h1>

      
      <div className="section">
        <h2>Get Movie Roles</h2>
        <div className="input-row">
          <input
            placeholder="Movie ID (e.g. 1001)"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
          />
          <input
            placeholder="Actor ID (optional)"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
          />
          <button onClick={fetchMovieRoles}>Search</button>
        </div>

        {movieError && <p className="error">{movieError}</p>}

        {movieRoles && (
          <div className="results">
            <h3>Roles for Movie {movieRoles.movieId}</h3>
            {movieRoles.roles.length === 0 ? (
              <p>No roles found</p>
            ) : (
              movieRoles.roles.map((role: any, i: number) => (
                <div key={i} className="card">
                  <h4>{role.roleName}</h4>
                  <p><strong>Actor ID:</strong> {role.actorId}</p>
                  <p>{role.roleDescription}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

     
      <div className="section">
        <h2>Get Actor Bio</h2>
        <div className="input-row">
          <input
            placeholder="Actor ID (e.g. 2001)"
            value={actorId}
            onChange={(e) => setActorId(e.target.value)}
          />
          <input
            placeholder="Movie ID (optional)"
            value={movieFilter}
            onChange={(e) => setMovieFilter(e.target.value)}
          />
          <button onClick={fetchActorBio}>Search</button>
        </div>

        {actorError && <p className="error">{actorError}</p>}

        {actorBio && (
          <div className="results">
            <div className="card">
              <h3>{actorBio.name}</h3>
              <p><strong>Date of Birth:</strong> {actorBio.dateOfBirth}</p>
              <p>{actorBio.bio}</p>
              {actorBio.role && (
                <div className="role">
                  <h4>Role: {actorBio.role.roleName}</h4>
                  <p>{actorBio.role.roleDescription}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;