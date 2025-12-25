# MovieRecommender Pro

A production-ready full-stack movie recommendation system that wraps your existing Python recommendation engine with a modern web interface.

## 🚀 Features

- **AI-Powered Recommendations**: Content-based and collaborative filtering
- **Modern UI**: React + Vite + TailwindCSS + shadcn/ui components
- **Secure Authentication**: JWT tokens with bcrypt password hashing
- **Real-time API**: FastAPI backend with automatic OpenAPI docs
- **Responsive Design**: Mobile-first with dark mode support
- **Production Ready**: Docker deployment, PostgreSQL database, rate limiting

## 🏗️ Architecture

```
├── backend/                 # FastAPI Python backend
│   ├── main.py             # FastAPI app entry point
│   ├── database.py         # PostgreSQL connection
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database operations
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── movies.py       # Movie recommendation endpoints
│   │   └── users.py        # User management endpoints
│   ├── services/           # Business logic
│   │   └── recommender.py  # Your existing Python recommender (wrapped)
│   └── alembic/            # Database migrations
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API client
│   │   └── store/          # Zustand state management
│   └── package.json
└── docker-compose.yml      # One-command deployment
```

## 🛠️ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or use Docker)

### Option 1: Local Development

1. **Clone and setup**
```bash
git clone <repository>
cd Automatic_Movie_Recommendation_System
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
alembic upgrade head
uvicorn main:app --reload
```

3. **Frontend Setup** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Docker Deployment (Recommended)

```bash
# One command to rule them all
docker compose up

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432
```

## 🧪 Testing the Application

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Get recommendations** - the system will show top-rated movies
4. **Search for similar movies** - enter a movie name to find similar ones
5. **Rate movies** - click stars to rate and improve recommendations

### Sample API Calls

```bash
# Register user
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get recommendations (replace TOKEN)
curl -X GET "http://localhost:8000/movies/recommend/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search similar movies
curl -X GET "http://localhost:8000/movies/recommend/similar/Avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/movierecommender
JWT_SECRET=your-super-secret-jwt-key-change-in-production
TMDB_API_KEY=your-tmdb-api-key-optional
```

### Frontend Configuration
- API base URL is configured in `src/lib/api.ts`
- Tailwind theme in `tailwind.config.js`
- Vite proxy settings in `vite.config.ts`

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movies table (populated from your CSV data)
CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    genre VARCHAR,
    poster_url VARCHAR,
    overview TEXT,
    vote_average FLOAT,
    vote_count INTEGER,
    release_date VARCHAR
);

-- Ratings table (user feedback)
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    movie_id INTEGER REFERENCES movies(id),
    rating FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Render.com (Backend)
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy command: `pip install -r requirements.txt && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Update API base URL in production

### Docker Production
```bash
# Build and run in production mode
docker compose -f docker-compose.prod.yml up -d
```

## 🔍 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Movies
- `GET /movies/recommend/{user_id}` - Get personalized recommendations
- `GET /movies/recommend/similar/{movie_name}` - Get similar movies
- `GET /movies/{movie_id}` - Get movie details
- `GET /movies` - List movies

### Users
- `GET /users/{user_id}/history` - Get user's watch history
- `GET /users/{user_id}/ratings` - Get user's ratings
- `POST /users/{user_id}/ratings` - Rate a movie

## 🧠 Recommendation Engine

The system integrates your existing Python recommendation engine (`Backend.py`) with these enhancements:

- **Content-based filtering**: Uses movie overviews and TF-IDF vectorization
- **Collaborative filtering**: Analyzes user rating patterns
- **Hybrid approach**: Combines both methods for better accuracy
- **Real-time scoring**: Calculates similarity scores for explanations

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme switching
- **Smooth Animations**: Framer Motion transitions
- **State Management**: Zustand for user state, React Query for server state
- **Form Validation**: React Hook Form with Zod schemas
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth with 30min expiry
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured for specific origins
- **Rate Limiting**: Built-in FastAPI rate limiting
- **Input Validation**: Pydantic schemas for all API inputs
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: React Query for client-side caching
- **Lazy Loading**: Code splitting with React.lazy
- **Image Optimization**: Placeholder images and error handling
- **Bundle Optimization**: Vite's built-in optimizations

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   docker compose ps
   # Reset database
   docker compose down -v && docker compose up
   ```

2. **CORS Errors**
   - Ensure frontend URL is in backend CORS origins
   - Check API base URL in frontend configuration

3. **JWT Token Issues**
   - Check token expiry (30 minutes)
   - Verify JWT_SECRET is set correctly

4. **Movie Data Not Loading**
   - Ensure CSV files are in the correct location
   - Check file permissions and paths

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using FastAPI, React, and modern web technologies**