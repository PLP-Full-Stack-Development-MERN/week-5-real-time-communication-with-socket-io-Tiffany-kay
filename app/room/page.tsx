"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserList } from "@/components/user-list";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from 'lucide-react';

interface User {
  id: string;
  username: string;
}


export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const roomId = params.roomId as string
  const username = searchParams.get("username") || "Anonymous"

  const [socket, setSocket] = useState<Socket | null>(null)
  const [note, setNote] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    setNote(newNote)
    socket?.emit("note:update", newNote)
  }

  const handleSaveNote = async () => {
    if (!socket) return
    setIsSaving(true)
    try {
      socket.emit("note:save", note, (response: { success: boolean }) => {
        // ... existing save logic ...
        setIsSaving(false)
      })} catch (error) {
        setIsSaving(false)
      }
    }
  return (
    <div className="min-h-screen cream-gradient p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Note Area */}
          <div className="flex-1">
            <Card className="glass-effect">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-blue-600">Collaborative Note</CardTitle>
                    <p className="text-sm text-blue-400">Room ID: {roomId}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isConnected ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Connected
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-red-200">
                        Disconnected
                      </Badge>
                    )}
                    <Button 
                      onClick={handleSaveNote} 
                      disabled={isSaving}
                      className="blue-gradient hover:opacity-90 transition-opacity"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[60vh] resize-none glass-effect border-blue-200 focus:border-blue-400 transition-colors"
                  placeholder="Start typing your collaborative note here..."
                  value={note}
                  onChange={handleNoteChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Users Sidebar */}
          <div className="w-full md:w-80">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-600">
                  Connected Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserList users={users} currentUser={username} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}