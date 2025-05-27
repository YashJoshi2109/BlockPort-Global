# BlockPort Global - Backend API

A FastAPI-based backend for BlockPort Global, providing secure escrow and smart contract management for global trade.

## 🚀 Features

- **FastAPI** with automatic OpenAPI documentation
- **PostgreSQL** database integration
- **JWT Authentication** with refresh tokens
- **CORS** middleware for frontend integration
- **Alembic** database migrations
- **Docker** ready configuration
- **Production** deployment on Render

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL database
- pip or poetry for dependency management

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/BlockPort-Global.git
cd BlockPort-Global/backend
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database_name

# JWT Configuration
JWT_SECRET=your-32-character-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
CORS_ORIGINS=https://block-port-global.vercel.app

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=BlockPort Global
VERSION=1.0.0
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Setup

The application will automatically create tables on startup. For production, use Alembic migrations:

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Development Server

```bash
# Using the run script
python run.py

# Or directly with uvicorn
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

## 📚 API Documentation

Once the server is running, access:

- **Interactive API Docs**: http://127.0.0.1:8000/docs
- **ReDoc Documentation**: http://127.0.0.1:8000/redoc
- **OpenAPI JSON**: http://127.0.0.1:8000/api/v1/openapi.json
- **Health Check**: http://127.0.0.1:8000/health

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── core/
│   │   ├── config.py        # Configuration settings
│   │   └── database.py      # Database connection
│   └── api/
│       └── v1/
│           └── endpoints/   # API route handlers
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
├── alembic.ini             # Alembic configuration
├── run.py                  # Development server script
└── README.md               # This file
```

## 🚀 Production Deployment

### Render.com

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Use the following configuration:

```yaml
# render.yaml
services:
  - type: web
    name: blockport-global-api
    env: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

### Environment Variables for Production

Set these in your deployment platform:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string (32+ characters)
- `CORS_ORIGINS`: Your frontend domain

## 🔧 Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

### Database Migrations

See [MIGRATIONS.md](../MIGRATIONS.md) for detailed migration instructions.

## 📝 API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token

### Users

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile

### Dashboard

- `GET /api/v1/dashboard/stats` - Get dashboard statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@blockportglobal.com or create an issue on GitHub.
