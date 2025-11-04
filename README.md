# 🧠 Project Satori

A full-stack, AI-powered platform built with FastAPI (backend) and React (frontend). This repository contains both the backend and frontend code, fully containerized with Docker for easy deployment.

---

## 📂 Repository Structure

```plaintext
satori/
├── .gitignore
├── docker-compose.yml
├── README.md
├── backend/
└── frontend/
```

---

## ⚙️ Backend

The backend is a self-contained FastAPI application built with Poetry for dependency management and Alembic for database migrations.

```plaintext
backend/
├── alembic/
├── alembic.ini
├── app/
│   ├── ai/
│   │   ├── agents/
│   │   └── models/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py
│   │       └── routes/
│   ├── core/
│   ├── crud/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   └── services/
├── scripts/
├── tests/
├── Dockerfile
├── Dockerfile.dev
└── pyproject.toml
```

---

## 🖥️ Frontend

The frontend is a modern React application built with Vite, providing a fast development experience and optimized production build.

```plaintext
frontend/
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── nginx.conf
├── package.json
├── vite.config.js
└── src/
    ├── assets/
    ├── components/
    │   └── ui/
    ├── lib/
    └── services/
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- **WebGL**: Make sure WebGL is enabled in your browser.
- **Dark Mode**: Our website does not have a dedicated dark mode. If you have any dark mode extensions enabled, please disable them for the best experience.

### Pure Docker Workflow

```bash
docker-compose up --build
```

Access the app: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

Create a `.env` file in `satori/backend/` with the following variables:

```env
# Security (generate a new one for your instance)
SECRET_KEY="<generate_with_openssl_rand_hex_32>"

# Google Gemini API
GOOGLE_API_KEY="<your_google_ai_api_key_with_billing_enabled>"
```

---

## 📈 Project Status

- **Phase 1** — Backend Data Engine ✅
- **Phase 2** — AI Agent Layer ✅
- **Phase 3** — Frontend UI & Full-Stack Integration ✅
- **Phase 4** — Intelligent Growth Platform (Roadmap & Recommendations) ✅ (Core Features Complete)
- **Phase 5** — Intelligent growth platform (scalable mentor, skill tree, real-time market insights) 🛣️ (planned)

---

## 🎬 Implementation Video

Watch a demo of Satori in action:

[![Watch the video](https://img.youtube.com/vi/wQYMEWm81xI/0.jpg)](https://youtu.be/wQYMEWm81xI)

---

## ⚠️ Known Issues & Next Steps

This section documents areas for improvement and challenges encountered during the hackathon. The application is fully functional in its local Docker environment.

1. **AI Mentor Token Optimization**  
   **Issue**: The current implementation of the AI Mentor chat includes the user's full, multi-week roadmap in the context of every single message. While functional, this is not token-efficient and could become costly with very long roadmaps.  
    **Next Step**: The immediate next step is to re-architect this feature using a Retrieval-Augmented Generation (RAG) pipeline. The user's roadmap will be stored in a vector database, allowing the mentor to retrieve only the most relevant sections for each specific question, drastically reducing token consumption.

2. **Automated Cloud Deployment**  
   **Issue**: While the application is fully containerized, we encountered platform-specific challenges deploying to a live URL. The initial, one-time database migration process (via Alembic) takes longer than the maximum startup health check timeouts on serverless platforms like Google Cloud Run. Manual migration attempts via the Cloud SQL Proxy were blocked by local network/firewall issues.
    **Next Step**: The professional solution is to create a CI/CD pipeline (e.g., with Google Cloud Build or GitHub Actions). This pipeline would separate the slow migration task into its own one-time job, allowing the main web service to start instantly and pass all health checks.

---

## 🧑‍💻 Development Notes

- The frontend is built with **Vite, React, and Tailwind CSS**, providing a modern, fast development experience.
- The backend uses **FastAPI and asynchronous SQLAlchemy 2.0**.
- The entire architecture is containerized and ready for scalable deployment.

---

## 🤝 Contributing

Contributions are what make a team project thrive. We follow the standard GitHub Flow for collaboration.

1. **Never push directly to `main`**. The `main` branch is protected and should always be stable.
2. For now, the `dev` branch is also protected. You must open pull requests to `dev` as well.
3. Create a new **Branch** for your feature (`git checkout -b feature/AmazingFeature`).
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5. Push to your Branch (`git push origin feature/AmazingFeature`).
6. Open a **Pull Request** against the `dev` branch for review (later this will change to `main`).

---

## 📜 License

```txt
MIT License

Copyright (c) 2025 Project Satori

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
