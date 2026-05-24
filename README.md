# Madar — Job Simulation Platform

Madar is a full-stack web application that lets users practice tasks for three career tracks: **Software Engineering**, **Data Science**, and **Product Management**. Users apply to simulated job listings, complete role-specific tasks powered by AI evaluation, and receive feedback and scores on their performance.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend](#backend)
- [Frontend](#frontend)

---

## Features

- Apply to simulated job listings
- Complete role-specific tasks
- AI-powered evaluation and scoring of submissions
- Review page with feedback
- User authentication and profile management
- Admin dashboard for managing users and jobs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, Flask |
| AI | Groq API |
| Database | SQLserver |
| AI  | ONE COMPILER API

---

## Project Structure

```
Madar/
├── backend/                  # Flask API server
│   ├── ai/                   # AI engine and task evaluators
│   │   ├── ai_engine.py      # Core AI evaluation logic
│   │   ├── evaluation.py     # Scoring and feedback builder
│   │   ├── majors_data.py    # Career track definitions and metadata
│   │   └── task/             # Task-specific AI prompts & handlers
│   │       ├── data_science/
│   │       │   ├── clean_data.py       # Data cleaning task
│   │       │   └── data_analyst.py     # Data analysis task
│   │       ├── product_manager/
│   │       │   ├── review_comments.py  # Comment review task
│   │       │   ├── review_document.py  # Document review task
│   │       │   ├── stakeholder_notes.py# Stakeholder notes task
│   │       │   └── ux_problem.py       # UX problem-solving task
│   │       └── software_engineering/
│   │           ├── code_review.py      # Code review task
│   │           ├── debug_code.py       # Debugging task
│   │           ├── performance.py      # Performance optimization task
│   │           ├── requirements.py     # Requirements analysis task
│   │           └── write_function.py   # Function writing task
│   ├── app/                  # Flask application
│   │   ├── config.py         # App configuration
│   │   ├── extensions.py     # Flask extensions
│   │   ├── middleware/
│   │   │   ├── admin_guard.py  # Admin-only route protection
│   │   │   └── auth_guard.py   # Authentication middleware
│   │   ├── models/           # Database models
│   │   │   ├── job.py
│   │   │   ├── profile.py
│   │   │   ├── review.py
│   │   │   ├── simulation.py
│   │   │   ├── submission.py
│   │   │   ├── task.py
│   │   │   └── user.py
│   │   ├── routes/           # API route handlers
│   │   │   ├── admin.py
│   │   │   ├── ai.py
│   │   │   ├── auth.py
│   │   │   ├── jobs.py
│   │   │   ├── profile.py
│   │   │   ├── review.py
│   │   │   ├── simulation.py
│   │   │   ├── submission.py
│   │   │   └── tasks.py
│   │   ├── schemas/          # Request/response validation schemas
│   │   │   ├── auth.py
│   │   │   ├── job.py
│   │   │   ├── review.py
│   │   │   └── submission.py
│   │   ├── services/         # Business logic layer
│   │   │   ├── ai_service.py       # Bridges routes and AI engine
│   │   │   ├── auth_service.py     # Authentication logic
│   │   └── utils/
│   │       ├── errors.py     # Custom error classes
│   │       └── response.py   # Standardized API responses
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # App entry point
│
└── frontend/                 # React + TypeScript client
    ├── src/
    │   ├── App.tsx            # Root component and routing
    │   ├── pages/             # Top-level page components
    │   │   ├── HomePage.tsx
    │   │   ├── AuthPage.tsx
    │   │   ├── JobPage.tsx
    │   │   ├── TaskSimulationPage.tsx
    │   │   ├── ReviewPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   └── AdminPage.tsx
    │   ├── components/        # Reusable UI components
    │   │   ├── admin/         # Admin dashboard sections
    │   │   ├── auth/          # Login and signup forms
    │   │   ├── home/          # Landing page sections
    │   │   ├── job/           # Job listing display
    │   │   ├── review/        # Score ring and feedback cards
    │   │   └── task/          # Task UI per career track
    │   │       ├── Data-Scientist/   # Data analysis interface
    │   │       ├── Software-Engineer/# Code editor interface
    │   │       └── product-manager/  # PM task views
    │   ├── hooks/             # Custom React hooks (API calls)
    │   ├── services/          # Axios API service functions
    │   ├── store/             # Global state (auth, interests)
    │   ├── types/             # TypeScript type definitions
    │   └── utils/             # Utility functions
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A virtual environment tool (e.g. `venv`)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py              
```

The API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Backend

### API Routes

| Prefix | Description |
|---|---|
| `/auth` | Register, login, logout |
| `/jobs` | List and view job simulations |
| `/tasks` | Fetch tasks for a simulation |
| `/simulation` | Start and manage a simulation session |
| `/submission` | Submit task answers |
| `/ai` | Trigger AI evaluation |
| `/review` | Fetch evaluation results |
| `/profile` | User profile management |
| `/admin` | Admin-only user and job management |

### Database Models

- **User** — account credentials and role
- **Profile** — career interests and bio
- **Job** — simulated job listing with career track
- **Task** — individual task within a job
- **Simulation** — a user's active job simulation session
- **Submission** — a user's answer to a task
- **Review** — AI-generated feedback on a submission

---

## Frontend

### Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with job listings |
| Auth | `/auth` | Login and sign-up |
| Job | `/job/:id` | Job details and task overview |
| Task Simulation | `/simulation/:id` | Interactive task workspace |
| Review | `/review/:id` | AI feedback and scores |
| Profile | `/profile` | User profile and history |
| Admin | `/admin` | Admin dashboard |
