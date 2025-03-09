import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: string;
  username: string;
}

interface UserListProps {
  users: User[];
  currentUser: string;
}

export function UserList({ users, currentUser }: UserListProps) {
  // Function to get initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to generate a consistent color based on username
  const getUserColor = (username: string) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    
    // Simple hash function to get a consistent index
    const hash = username.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Users in Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users connected</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className={getUserColor(user.username)}>
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user.username}
                    {user.username === currentUser && " (You)"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
