import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    default: "",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
})

export const Note = mongoose.model("Note", noteSchema)

