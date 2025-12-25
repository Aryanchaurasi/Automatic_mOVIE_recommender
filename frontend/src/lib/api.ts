import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Movie {
  id: number;
  title: string;
  genre?: string;
  poster_url?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  similarity_score?: number;
  reason?: string;
}

export interface Rating {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  created_at: string;
  movie: Movie;
}

export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  me: () => api.get('/auth/me'),
};

export const moviesApi = {
  getRecommendations: (userId: number, topN: number = 10) =>
    api.get(`/movies/recommend/${userId}?top_n=${topN}`),
  
  getSimilarMovies: (movieName: string, topN: number = 5) =>
    api.get(`/movies/recommend/similar/${encodeURIComponent(movieName)}?top_n=${topN}`),
  
  getMovieDetails: (movieId: number) =>
    api.get(`/movies/${movieId}`),
  
  getMovies: (skip: number = 0, limit: number = 20) =>
    api.get(`/movies?skip=${skip}&limit=${limit}`),
};

export const usersApi = {
  getUserHistory: (userId: number) =>
    api.get(`/users/${userId}/history`),
  
  getUserRatings: (userId: number) =>
    api.get(`/users/${userId}/ratings`),
  
  createRating: (userId: number, movieId: number, rating: number) =>
    api.post(`/users/${userId}/ratings`, { movie_id: movieId, rating }),
};