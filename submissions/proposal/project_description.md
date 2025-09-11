# Project Satori: Your Personal AI Career Advisor

## Project Goals

The primary goal of Project Satori is to democratize career guidance for students across India, addressing the widespread challenges of career confusion and anxiety through a freely accessible, intelligent, and deeply personalized advisory platform. Our key objectives include:

1. **Empowering Students**: Equip students with the clarity and confidence to make informed career decisions based on their unique interests, skills, and aptitudes, free from societal or peer pressures.

2. **Bridging the Skills Gap**: Deliver actionable, industry-aligned learning roadmaps that outline precisely what skills to acquire, ensuring students are job-ready upon graduation.

3. **Ensuring Universal Access**: Make high-quality mentorship available to every student, irrespective of geographic location—from bustling metropolises to smaller cities like Rourkela.

## Functionalities

Project Satori is a fully functional web application that guides users from uncertainty to clarity via an intuitive, streamlined journey:

1. **Secure User Authentication**: Users can create accounts and log in securely using a robust JWT (JSON Web Token)-based system.

2. **Career Compass Questionnaire**: Upon login, users complete a dynamic assessment featuring insightful questions on academic interests, creative inclinations, problem-solving styles, and work-life preferences.

3. **AI-Powered Career Recommendations**: User responses are analyzed by our AI engine, which generates 3-5 tailored career paths, including detailed descriptions and projected salary ranges.

4. **Personalized Learning Roadmaps**: The cornerstone of Satori, this feature allows users to select a career and receive a comprehensive, week-by-week plan. It details specific topics to study, skills to master, and projects to undertake over several months for proficiency.

5. **Conversational AI Mentor**: A new, dedicated page allows users to have a stateful conversation with an AI mentor, asking specific questions about their generated roadmap and receiving context-aware answers.

## Technical Implementation

Project Satori leverages a modern, scalable, and high-performance technology stack optimized for cloud-native deployment.

- **Backend**: The API is developed with FastAPI (Python), capitalizing on its asynchronous features for superior throughput. PostgreSQL serves as the database, integrated with SQLAlchemy 2.0 ORM for efficient, secure asynchronous queries. Schema migrations are managed seamlessly via Alembic.

- **Frontend**: The user interface is a dynamic single-page application crafted with React and Vite for rapid development and optimized builds. Tailwind CSS ensures responsive, visually appealing styling.

- **AI Engine**: The intelligence layer is powered by the Google Gemini API, orchestrated through the LangChain framework. This agent-based architecture has been refactored for consistency and power:

  - A central `llm_provider` initializes a shared instance of the Gemini model using `langchain-google-genai`.
  - The `RecommendationAgent` and `RoadmapAgent` are stateless agents that use the shared LangChain LLM to generate their respective JSON payloads.
  - The new `MentorAgent` is a stateful, conversational agent built using **LangChain Expression Language (LCEL)**, incorporating `ConversationBufferMemory` to remember chat history and provide context-aware responses.

- **Infrastructure & DevOps**: The application is containerized with Docker and orchestrated using Docker Compose, promoting consistent, reproducible environments ideal for development and scalable deployments on platforms like Google Cloud Run.

## Social Impact

In India, where career choices profoundly influence life trajectories, Project Satori acts as a vital intervention with far-reaching social benefits:

1. **Democratizing Opportunity**: By extending premium career counseling—typically limited to urban elites or those with resources—to anyone with internet access, Satori equalizes opportunities for students in Tier-2 and Tier-3 cities.

2. **Reducing Student Stress**: Satori replaces ambiguity with clear, actionable plans, alleviating the mental health strains and anxiety experienced by millions of students facing pivotal decisions.

3. **Enhancing Employability**: AI-driven roadmaps align with evolving industry needs, bridging the divide between academic training and real-world demands to produce more competitive, job-ready graduates.

4. **Fostering Passion and Potential**: By matching careers to individual personalities and interests, Satori cultivates a workforce that is not only skilled but also engaged, innovative, and fulfilled, contributing to broader societal well-being.
