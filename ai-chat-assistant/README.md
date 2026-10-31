# 🤖 Modern AI Chat Assistant (ChatGPT Clone)

A modern, responsive, full-stack AI Chat Assistant web application built with React, Node.js, Express, MongoDB, and JWT authentication.

![UI](https://img.shields.io/badge/UI-ChatGPT%20Style-10a37f?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt-000000?style=for-the-badge&logo=jsonwebtokens)

---

## ✨ Features

### 1. Main Interface
* **Collapsible Modern Sidebar**:
  * "New Chat" button (`Ctrl+K` shortcut support)
  * Real-time conversation search filter
  * Chronological conversation history list
  * Inline rename & delete conversation actions
  * User profile widget with initials avatar & settings
* **Main Chat Area**:
  * Welcome screen with quick prompt starter cards
  * Clean branding header with model switcher
  * User prompts aligned right with custom avatar
  * AI responses aligned left with bot avatar
  * Full Markdown parser supporting headings, lists, quotes, tables, and bold/italic
  * Code blocks with language tags and one-click "Copy Code" animation
  * Response action bar: Copy message, Text-to-Speech (read aloud), Regenerate response, and Delete message
  * Smooth typing/thinking animation indicator while AI responds
* **Prompt Input**:
  * Rounded expandable input box
  * Auto-resizing textarea
  * `Enter` to send, `Shift + Enter` for new lines
  * Send button with disabled state when empty
  * Integrated Voice Recognition (Web Speech API dictation)
  * Stop generating button
* **Themes & Accessibility**:
  * Seamless Dark and Light theme toggle
  * Fully responsive on Desktop, Laptop, Tablet, and Mobile devices
  * Export conversation as `.MD` (Markdown), `.JSON`, or `.TXT`

### 2. Backend & Security
* **Authentication**: JWT token-based auth with secure password hashing (`bcryptjs`).
* **Multi-Provider AI Service (`aiService.js`)**:
  * Pluggable architecture supporting Google Gemini API (`GEMINI_API_KEY`), OpenAI (`OPENAI_API_KEY`), or an Intelligent Built-in Simulator (zero-key offline mode).
  * Auto-generates concise conversation titles from initial prompt.
* **Rate Limiting**: Protects chat and authentication endpoints against abuse.
* **Safe Error Handling**: Prevents leakage of stack traces or sensitive environment secrets.
* **Database Agility**: MongoDB via Mongoose with an automatic in-memory fallback for instant setup.

---

## 📁 Project Structure

```
ai-chat-assistant/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection & status
│   │   └── store.js              # Unified data store abstraction
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token validation
│   │   ├── rateLimiter.js        # IP rate limiting
│   │   └── errorHandler.js       # Safe error formatting
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt methods
│   │   ├── Conversation.js       # Conversation schema
│   │   └── Message.js            # Message schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/register, login, profile
│   │   ├── conversationRoutes.js # /api/conversations CRUD
│   │   └── chatRoutes.js         # /api/chat, regenerate, messages
│   ├── services/
│   │   └── aiService.js          # Multi-model AI abstraction
│   ├── tests/
│   │   └── test_api.js           # Automated backend test suite
│   ├── .env.example
│   ├── server.js                 # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js        # Conversation list, search, user menu
│   │   │   ├── ChatArea.js       # Main message feed & header
│   │   │   ├── MessageBubble.js  # Markdown & syntax highlight renderer
│   │   │   ├── PromptInput.js    # Expandable input with voice dictation
│   │   │   ├── WelcomeScreen.js  # Example starter cards
│   │   │   ├── AuthModal.js      # Sign In / Sign Up modal
│   │   │   ├── ModelSelector.js  # Dropdown model switcher
│   │   │   ├── SettingsModal.js  # Themes, Export, Shortcuts
│   │   │   └── LoadingDots.js    # Typing animation
│   │   ├── context/
│   │   │   ├── AuthContext.js    # Authentication state
│   │   │   ├── ChatContext.js    # Conversation & message state
│   │   │   └── ThemeContext.js   # Light/Dark mode state
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── styles/
│   │   │   ├── index.css         # CSS variables & typography
│   │   │   ├── sidebar.css       # Sidebar styles
│   │   │   ├── chat.css          # Messages, markdown & input styles
│   │   │   └── auth.css          # Modals & settings styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v16+ or higher)
* [MongoDB](https://www.mongodb.com/) (Optional — an in-memory fallback enables instant zero-setup execution)

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# (Optional) Configure environment variables
# Copy .env.example to .env and set your API keys if available
cp .env.example .env

# Start backend server
npm start
```
*Backend runs on `http://localhost:5000`*

### 3. Frontend Setup
In a separate terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```
*Frontend opens at `http://localhost:3000`*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log into account and receive JWT | No |
| `GET` | `/api/auth/profile` | Get current user's profile | Yes |
| `GET` | `/api/conversations` | Retrieve all user conversations | Yes |
| `POST` | `/api/conversations` | Create a new conversation | Yes |
| `GET` | `/api/conversations/:id` | Fetch conversation and message history | Yes |
| `PATCH`| `/api/conversations/:id` | Rename conversation title | Yes |
| `DELETE`| `/api/conversations/:id` | Delete conversation and its messages | Yes |
| `POST` | `/api/chat` | Send prompt & receive AI response | Yes |
| `POST` | `/api/chat/regenerate` | Regenerate response for last user prompt | Yes |
| `DELETE`| `/api/messages/:id` | Delete an individual message | Yes |

---

## 🛡️ Security Best Practices Implemented
1. **Never Expose AI API Keys**: API keys are strictly confined to backend environment variables.
2. **Password Hashing**: Passwords salted and hashed with `bcryptjs` before storage.
3. **Protected Routes**: Middleware verifies incoming Bearer JWT tokens on every sensitive request.
4. **Data Isolation**: Users are scoped so they can only view, edit, or delete their own conversations.
5. **Rate Limiting**: Express rate limiters protect chat and authentication endpoints against abuse.
