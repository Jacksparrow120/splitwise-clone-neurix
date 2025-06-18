# Splitwise Clone – Full Stack App (FastAPI + React)

This is a simplified Splitwise-like application where users can create groups, add expenses, track balances, and interact with an AI assistant. The project uses FastAPI for the backend and React with TailwindCSS for the frontend. A Docker setup is provided for full-stack deployment.

## Project Structure

splitwise-clone/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (for containerized setup)

## Run Locally

### 1. Clone the Repository

git clone https://github.com/<your-username>/splitwise-clone.git  
cd splitwise-clone

### 2. Backend Setup (FastAPI)

cd backend  
python -m venv env  
source env/bin/activate  # On Windows use `env\Scripts\activate`  
pip install -r requirements.txt

Create a `.env` file inside `backend/`:

OPENAI_API_KEY=your-api-key-here

Run backend:

uvicorn app.main:app --reload

Open API docs at:  
http://localhost:8000/docs

### 3. Frontend Setup (React)

cd frontend  
npm install  
npm run dev

App runs at:  
http://localhost:3000

### 4. Run Full Stack with Docker (Optional)

docker-compose up --build

## API Documentation

### Base URL: /

#### POST /groups/
Create a group  
Payload:
{
  "name": "Goa Trip",
  "members": ["Kartavya", "Aman", "Shubham"]
}

#### GET /groups/
List all groups

#### GET /groups/{group_id}/balances
Get balances for a group

#### POST /groups/{group_id}/expenses
Add expense  
Equal Split Payload:
{
  "description": "Lunch",
  "amount": 1500,
  "paid_by": 1,
  "split_type": "equal"
}

Percentage Split Payload:
{
  "description": "Cab",
  "amount": 1000,
  "paid_by": 2,
  "split_type": "percentage",
  "splits": [
    {"user_id": 1, "percentage": 50},
    {"user_id": 2, "percentage": 30},
    {"user_id": 3, "percentage": 20}
  ]
}

#### POST /chat/
Ask the AI bot  
Payload:
{
  "query": "Who owes the most?",
  "group_name": "Goa Trip"
}

Returns: Chat response using OpenAI.

## Assumptions

1. Users are local to each group, no login/authentication.
2. Supported split types: "equal", "percentage".
3. AI chatbot works only if `.env` file with API key is present.
4. Bot answers are generated from prompt only; not linked to real-time DB balances.
5. PostgreSQL used locally or via Docker Compose.

## Environment Variables

backend/.env

OPENAI_API_KEY=your-openai-key

## License

This project is for demo and learning purposes only.
