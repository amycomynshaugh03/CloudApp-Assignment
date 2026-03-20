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
  const [language, setLanguage]         = useState('');
  const [actorBio, setActorBio]         = useState<any>(null);
  const [actorError, setActorError]     = useState('');

  const [postMovieId, setPostMovieId]   = useState('');
  const [postActorId, setPostActorId]   = useState('');
  const [postRoleName, setPostRoleName] = useState('');
  const [postRoleDesc, setPostRoleDesc] = useState('');
  const [postApiKey, setPostApiKey]     = useState('');
  const [postResult, setPostResult]     = useState<any>(null);
  const [postError, setPostError]       = useState('');

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
      let url = `${API_BASE_URL}/actors/${actorId}`;
      const params = [];
      if (movieFilter) params.push(`movie=${movieFilter}`);
      if (language) params.push(`language=${language}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      const res = await axios.get(url);
      setActorBio(res.data);
    } catch (err: any) {
      setActorError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const addMovieRole = async () => {
    setPostError('');
    setPostResult(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/movies/role`,
        {
          movieId: parseInt(postMovieId),
          actorId: parseInt(postActorId),
          roleName: postRoleName,
          roleDescription: postRoleDesc,
        },
        {
          headers: {
            'x-api-key': postApiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      setPostResult(res.data);
    } catch (err: any) {
      setPostError(
        err.response?.status === 403
          ? 'Invalid or missing API key — 403 Forbidden'
          : err.response?.data?.message || 'Something went wrong'
      );
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
          <input
            placeholder="Language code (optional, e.g. fr)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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

      <div className="section">
        <h2>Add Movie Role</h2>
        <div className="input-row">
          <input
            placeholder="Movie ID"
            value={postMovieId}
            onChange={(e) => setPostMovieId(e.target.value)}
          />
          <input
            placeholder="Actor ID"
            value={postActorId}
            onChange={(e) => setPostActorId(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            placeholder="Role Name"
            value={postRoleName}
            onChange={(e) => setPostRoleName(e.target.value)}
          />
          <input
            placeholder="Role Description"
            value={postRoleDesc}
            onChange={(e) => setPostRoleDesc(e.target.value)}
          />
        </div>
        <div className="input-row">
          <input
            placeholder="API Key"
            value={postApiKey}
            onChange={(e) => setPostApiKey(e.target.value)}
          />
          <button onClick={addMovieRole}>Add Role</button>
        </div>

        {postError && <p className="error">{postError}</p>}

        {postResult && (
          <div className="results">
            <div className="card">
              <h4>Role Added Successfully!</h4>
              <p><strong>Movie ID:</strong> {postResult.role.movieId}</p>
              <p><strong>Actor ID:</strong> {postResult.role.actorId}</p>
              <p><strong>Role Name:</strong> {postResult.role.roleName}</p>
              <p><strong>Description:</strong> {postResult.role.roleDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;