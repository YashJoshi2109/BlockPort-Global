# BlockPort Global

A smart contract escrow platform for secure and transparent transactions.

## Project Structure

```
BlockPort-Global/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md
```

hi

## Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.11+ (for local backend development)

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/YashJoshi2109/BlockPort-Global.git
cd BlockPort-Global
```

2. Start the development environment:

```bash
docker-compose up --build
```

3. Access the applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
