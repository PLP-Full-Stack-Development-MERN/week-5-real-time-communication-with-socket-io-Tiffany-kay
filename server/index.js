import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { Note } from "./models/note.js"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
app.use(cors())
app.use(express.json())

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/real-time-notes")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Store room data in memory
const rooms = new Map()

// Socket.io connection handler
io.on("connection", (socket) => {
  const { roomId, username } = socket.handshake.query

  // Join the specified room
  socket.join(roomId)

  // Create user object
  const user = {
    id: socket.id,
    username,
  }

  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: [],
      note: "",
    })

    // Try to load note from database
    Note.findOne({ roomId })
      .then((note) => {
        if (note) {
          rooms.get(roomId).note = note.content
          // Broadcast the note to all users in the room
          io.to(roomId).emit("note:update", note.content)
        }
      })
      .catch((err) => console.error("Error loading note:", err))
  }

  // Add user to room
  const room = rooms.get(roomId)
  room.users.push(user)

  // Broadcast updated user list
  io.to(roomId).emit("users:update", room.users)

  // Notify others that a user has joined
  socket.to(roomId).emit("user:joined", user)

  // Send current note to the new user
  socket.emit("note:update", room.note)

  // Handle note update
  socket.on("note:update", (content) => {
    // Update note in memory
    room.note = content

    // Broadcast to all other users in the room
    socket.to(roomId).emit("note:update", content)
  })

  // Handle note save
  socket.on("note:save", async (content, callback) => {
    try {
      // Save note to database
      await Note.findOneAndUpdate({ roomId }, { content, lastUpdated: new Date() }, { upsert: true, new: true })

      callback({ success: true })
    } catch (error) {
      console.error("Error saving note:", error)
      callback({ success: false })
    }
  })

  // Handle get note request
  socket.on("note:get", () => {
    socket.emit("note:update", room.note)
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove user from room
    room.users = room.users.filter((u) => u.id !== socket.id)

    // Broadcast updated user list
    io.to(roomId).emit("users:update", room.users)

    // Notify others that a user has left
    socket.to(roomId).emit("user:left", user)

    // Clean up empty rooms
    if (room.users.length === 0) {
      // Don't delete the room data yet, keep it for when users rejoin
      // rooms.delete(roomId);
    }
  })
})

// API routes
app.get("/api/notes/:roomId", async (req, res) => {
  try {
    const note = await Note.findOne({ roomId: req.params.roomId })
    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }
    res.json(note)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

