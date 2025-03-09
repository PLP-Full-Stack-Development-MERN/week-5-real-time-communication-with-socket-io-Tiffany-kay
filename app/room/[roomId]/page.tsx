"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { io, type Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserList } from "@/components/user-list"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

interface User {
  id: string
  username: string
}

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const roomId = params.roomId as string
  const username = searchParams.get("username") || "Anonymous"
  const { toast } = useToast()

  const [socket, setSocket] = useState<Socket | null>(null)
  const [note, setNote] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Connect to the Socket.io server
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      query: { roomId, username },
    })

    setSocket(socketInstance)

    // Clean up the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect()
    }
  }, [roomId, username])

  useEffect(() => {
    if (!socket) return

    // Handle socket events
    socket.on("connect", () => {
      setIsConnected(true)
      toast({
        title: "Connected to room",
        description: `You've joined room: ${roomId}`,
      })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("note:update", (updatedNote: string) => {
      setNote(updatedNote)
    })

    socket.on("users:update", (updatedUsers: User[]) => {
      setUsers(updatedUsers)
    })

    socket.on("user:joined", (user: User) => {
      toast({
        title: "User joined",
        description: `${user.username} has joined the room`,
      })
    })

    socket.on("user:left", (user: User) => {
      toast({
        title: "User left",
        description: `${user.username} has left the room`,
      })
    })

    // Request the current note when joining
    socket.emit("note:get")

    // Clean up event listeners
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("note:update")
      socket.off("users:update")
      socket.off("user:joined")
      socket.off("user:left")
    }
  }, [socket, roomId, toast])

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    setNote(newNote)

    // Emit the note change to the server
    if (socket) {
      socket.emit("note:update", newNote)
    }
  }

  const handleSaveNote = async () => {
    if (!socket) return

    setIsSaving(true)

    try {
      // Emit save event to the server
      socket.emit("note:save", note, (response: { success: boolean }) => {
        if (response.success) {
          toast({
            title: "Note saved",
            description: "Your note has been saved successfully",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to save note",
            variant: "destructive",
          })
        }
        setIsSaving(false)
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Collaborative Note</CardTitle>
                <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
              </div>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Disconnected
                  </Badge>
                )}
                <Button size="sm" onClick={handleSaveNote} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[60vh] resize-none"
                placeholder="Start typing your collaborative note here..."
                value={note}
                onChange={handleNoteChange}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-64">
          <UserList users={users} currentUser={username} />
        </div>
      </div>
    </div>
  )
}

