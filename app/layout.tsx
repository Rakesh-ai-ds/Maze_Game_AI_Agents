import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Maze Planet 3D - Ultimate Football Maze Adventure",
  description:
    "Navigate through 3D mazes, score goals, collect power-ups and become the ultimate maze football champion!",
  keywords: "maze, 3D game, football, soccer, puzzle, adventure, browser game",
  authors: [{ name: "Maze Planet 3D Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-hidden`}>{children}</body>
    </html>
  )
}
