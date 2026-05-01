# Team Task Manager

A professional, full-stack collaborative platform built with Spring Boot and React for secure, role-based project and task management.

## 🚀 Key Features

- **Strict Data Isolation**: Tasks and projects are only visible to the owner/creator and the specific member assigned to them. Privacy is enforced at the database level.
- **Advanced Role-Based Access Control (RBAC)**:
  - **Creators (`ADMIN`, `PROJECT_MANAGER`, `TEAM_LEAD`)**: Full workspace permissions including project and task creation.
  - **Collaborators (`MEMBER`, `QA`, `CLIENT`, `VIEWER`)**: Restricted access. They can only track and update statuses for projects they are involved in.
- **Dynamic Action Banners**: Real-time UI feedback that explains permission restrictions based on your active role.
- **Authentication**: Secure JWT-based registration and login with visual status feedback.
- **Task Workspace**: Interactive status tracking (`PENDING` ➔ `IN_PROGRESS` ➔ `COMPLETED`).

## 🛠 Tech Stack

- **Backend**: Java 17, Spring Boot 3.5, Spring Security, Hibernate, JWT
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons
- **Database**: MySQL (Production) & H2 (Local testing fallback)

## 📁 Project Structure

- `backend/`: Spring Boot REST API.
- `frontend/`: React SPA with a Workspace-driven layout.
- `Dockerfile`: Unified multi-stage build for Railway deployment.

## 📦 Local Setup

### 1. Prerequisites
- Java 17+
- MySQL Server

### 2. Run the Backend
Configure your credentials in `backend/src/main/resources/application.properties`, then:
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Railway Deployment

The project is optimized for Railway. When you link your GitHub repo:
1. Railway detects the `Dockerfile` in the root.
2. It builds the React frontend and packages it inside the Java JAR.
3. Add a **MySQL** service on Railway and link it to provide `DATABASE_URL`.

