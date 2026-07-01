# ⚔️ HitAI — Combat Video Analysis Pipeline

Real-time combat video analysis powered by a multi-stage AI pipeline with live progress streaming.

---

## Overview

HitAI is a full-stack application that simulates a multi-stage AI video analysis pipeline. Users submit a video URL, and the system processes it through six sequential stages — from download to insight generation — streaming progress updates in real time via **Server-Sent Events (SSE)**.

### Key Features

- **Multi-stage pipeline** — Six distinct processing stages with configurable durations
- **Real-time streaming** — Live progress via SSE with automatic reconnection and resumable `Last-Event-ID`
- **Persistent tasks** — Analysis state saved to disk (`tasks.json`) and resumed on server restart
- **Animated UI** — Framer Motion page transitions, stepper animations, ferrofluid shader background
- **Gooey navigation** — Custom animated navbar with fluid blob indicator

---

## Tech Stack

| Layer     | Technology                                                  |
| --------- | ----------------------------------------------------------- |
| Backend   | Python 3.11+, FastAPI, SSE (sse-starlette), Uvicorn         |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS 4                  |
| Streaming | Server-Sent Events (EventSource API)                        |
| Animation | Framer Motion, custom WebGL shaders (Ferrofluid, OGL/Three) |
| Routing   | React Router v7                                             |

---

## Project Structure

```
hitai-assignment/
├── backend/
│   ├── main.py              # FastAPI app — API routes, pipeline logic, SSE streaming
│   ├── tasks.json            # Persistent task storage (auto-generated)
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx      # Home — video URL input
│   │   │   └── AnalysisPage.tsx     # Analysis — live stepper, logs, progress
│   │   ├── components/
│   │   │   ├── VideoForm.tsx        # URL input with vanish animation
│   │   │   ├── AnalysisStatus.tsx   # Progress bar + connection badge
│   │   │   ├── AnalysisStepper.tsx  # Step-by-step visual pipeline
│   │   │   ├── Navbar.tsx           # Fixed floating navbar
│   │   │   ├── GooeyNav.tsx         # Animated blob navigation
│   │   │   ├── Ferrofluid.tsx       # WebGL ferrofluid background shader
│   │   │   └── placeholders-and-vanish-input.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalysisStream.ts # SSE connection + state management
│   │   │   └── useVideoForm.ts     # Form submission + navigation
│   │   ├── types/
│   │   │   └── api.ts              # TypeScript interfaces
│   │   ├── App.tsx                  # Router + animated routes
│   │   └── main.tsx                 # Entry point
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **npm**

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server (with hot reload)
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## API Reference

### `POST /analyses`

Create a new analysis task.

**Request Body:**
```json
{
  "video_url": "https://youtube.com/watch?v=..."
}
```

**Response:**
```json
{
  "analysis_id": "uuid-string",
  "status": "queued"
}
```

---

### `GET /analyses/{id}/stream`

Stream real-time progress updates via SSE.

**Headers:**
| Header            | Description                        |
| ----------------- | ---------------------------------- |
| `Last-Event-ID`   | Resume from a specific stage index |

**SSE Event Data:**
```json
{
  "analysis_id": "uuid",
  "stage": "detecting_actions",
  "progress": 47,
  "message": "Detecting actions",
  "status": "processing",
  "timestamp": "2026-07-02T01:00:00.000000",
  "logs": [...]
}
```

---

### `GET /analyses/{id}`

Get the current snapshot of an analysis task.

**Response:** Same shape as the SSE event data above.

---

## Pipeline Stages

Each analysis passes through these stages sequentially. The task is visible in each stage for its full configured duration before advancing.

| #   | Stage                  | Duration | Progress |
| --- | ---------------------- | -------- | -------- |
| 1   | `queued`               | 0s       | 0%       |
| 2   | `downloading_video`    | 3s       | 14%      |
| 3   | `extracting_frames`    | 6s       | 28%      |
| 4   | `detecting_actions`    | 10s      | 47%      |
| 5   | `segmenting_rounds`    | 5s       | 73%      |
| 6   | `generating_insights`  | 4s       | 89%      |
| ✓   | `completed`            | —        | 100%     |

**Total pipeline duration: ~28 seconds**

---

## Environment Variables

| Variable         | Default                  | Description         |
| ---------------- | ------------------------ | ------------------- |
| `VITE_API_URL`   | `http://127.0.0.1:8000`  | Backend API base URL |

---

## License

This project was built as an assignment for HitAI.
