import "../globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

// Add metadata
export const metadata = {
  title: 'Real-time Notes',
  description: 'Collaborative note-taking application',
}