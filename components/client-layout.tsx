"use client"

import React, { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { toast } from "@/components/ui/use-toast"
import {
  ToastProvider,
  ToastViewport
} from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "@/components/Sidebar"
import { LogOut, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "./ui/button"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/register']

  useEffect(() => {
    // On initial load, check if user is logged in
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const storedUsername = localStorage.getItem("username") || ""
      
      setIsLoggedIn(loggedIn)
      setUsername(storedUsername)
      setIsLoading(false)
      
      // If not logged in and not on a public route, redirect to login
      if (!loggedIn && !publicRoutes.includes(pathname)) {
        router.push("/login")
      }
    }
    
    checkLoginStatus()
  }, [pathname, router])
  
  const handleLogout = () => {
    // Clear login status
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    
    // Show toast
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    
    // Redirect to login page
    router.push("/login")
  }
  
  // Show nothing while checking login status
  if (isLoading) {
    return null
  }
  
  // If not logged in and not on a public route, don't render anything
  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return null
  }

  // For public routes (login/register), just render the children without the sidebar
  if (!isLoggedIn && publicRoutes.includes(pathname)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastProvider>
          {children}
          <ToastViewport />
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    )
  }
  
  // For authenticated routes, render with sidebar
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <ToastViewport />
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  )
} 