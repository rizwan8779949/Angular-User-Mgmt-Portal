# Angular 20 + JSON Server (Mock Backend)

This project is a full-stack development environment combining **Angular 20** (frontend) with a **Node.js-based JSON Server** (as a mock backend API). Ideal for rapid prototyping or front-end development without needing a real backend during early stages.

---

##  Project Structure

```bash
root/
├── frontend/              # Angular 20 app
│   └── src/               # Angular source files
├── backend/               # JSON Server files
│   ├── server.js            # Mock-server 
│   └── package.json      

└── README.md              # You're here!






---

## 🚀 Features

### 🔐 Login Page
- Simple form with username & password
- Mock authentication (no real login logic)
- Redirects to dashboard on "successful" login

### 📋 User Management Dashboard
- Fetch and display list of users from backend
- Add new user via modal form
- Edit existing user
- Delete user with confirmation
- NgRx used for all state management

### ⚙️ Backend Integration
- JSON Server used to simulate API
- REST endpoints for full CRUD

### 🎨 UI/UX
- Responsive design with Angular Material
- SCSS-based styling
- Accessible forms with labels and validation

---

## 🧪 Technologies Used

| Layer       | Tech                  |
|-------------|------------------------|
| Frontend    | Angular 20             |
| State Mgmt  | NgRx (Store, Effects)  |
| Backend     | JSON Server            |
| UI Library  | Angular Material       |
| Styling     | SCSS                   |
| Language    | TypeScript, JSON       |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/user-management-app.git
cd user-management-app

