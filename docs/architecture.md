# BlockPort Global Architecture

## System Overview

BlockPort Global is a smart contract escrow platform that enables secure and transparent transactions between parties. The system consists of three main components:

1. **Frontend**: React-based web application
2. **Backend**: FastAPI-based REST API
3. **Database**: PostgreSQL for data persistence

## Technology Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios (for API calls)

### Backend

- FastAPI
- SQLAlchemy (ORM)
- Pydantic (Data validation)
- PostgreSQL (Database)
- Passlib (Password hashing)

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL 13

## Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │  Database   │
│  (React)    │◄───►│  (FastAPI)  │◄───►│ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

## API Design

The backend API follows RESTful principles and is organized into the following main resources:

- `/auth` - Authentication endpoints
- `/contracts` - Smart contract management
- `/escrow` - Escrow transaction management
- `/users` - User management

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
