#GROUP 9
# Real-Time Collaborative Notes App

## Overview
This project is a real-time collaborative note-taking application that allows multiple users to create, edit, and view notes in real time. It utilizes **Socket.io** for WebSocket communication and is built on the **MERN stack** (MongoDB, Express.js, React, Node.js).

## Features
- Users can join specific "rooms" to collaborate on shared notes.
- Real-time updates when another user edits the note.
- Ability to create new notes and edit existing ones.
- Notifications when a new user joins or leaves a room.
- List of online users in each room.

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB
- **Deployment:** Backend (Render), Frontend (Vercel)

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (v16+ recommended)
- MongoDB (local or cloud-based)
- Git

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/real-time-notes.git
   cd real-time-notes
   ```

2. **Backend Setup:**
   ```sh
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     ```
   - Start the backend server:
     ```sh
     npm start
     ```

3. **Frontend Setup:**
   ```sh
   cd ../frontend
   npm install
   ```
   - Start the frontend:
     ```sh
     npm start
     ```

## Real-Time Features with Socket.io
- Users connect via WebSocket when they join a room.
- Notes are updated in real-time across all connected clients.
- The server broadcasts changes to all users in the same room.
- User join/leave notifications are displayed.

## Deployment
### Backend Deployment (Render)
1. Push your backend code to GitHub.
2. Deploy to **Render** by linking the GitHub repository.
3. Set up environment variables on Render.
4. Deploy and obtain the backend API URL.

### Frontend Deployment (Vercel)
1. Push your frontend code to GitHub.
2. Deploy to **Vercel** by linking the GitHub repository.
3. Configure the backend API URL in your `.env` file.
4. Deploy and get the frontend URL.

## Testing
- Open multiple browser tabs and join the same room.
- Make edits and verify they sync in real time.
- Check if users are notified when others join/leave.

## Key Real-Time Concepts Used
- **WebSockets & Socket.io**: Enables instant bidirectional communication.
- **Rooms & Namespaces**: Allows grouping users into collaborative sessions.
- **Event-Driven Programming**: Messages are sent and received based on specific triggers.

## Contribution
Feel free to fork this repository and submit pull requests!

## License
This project is licensed under the MIT License.

