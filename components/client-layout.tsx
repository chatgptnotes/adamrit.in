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

  useEffect(() => {
    // On initial load, check if user is logged in
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      const storedUsername = localStorage.getItem("username") || ""
      
      setIsLoggedIn(loggedIn)
      setUsername(storedUsername)
      setIsLoading(false)
      
      // If not logged in and not already on login page, redirect to login
      if (!loggedIn && pathname !== "/login") {
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
  
  // If not logged in and not on login page, don't render anything
  if (!isLoggedIn && pathname !== "/login") {
    return null
  }

  // Don't show the sidebar or header on the login page
  if (pathname === "/login") {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <ToastProvider>
          <ToastViewport />
        </ToastProvider>
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          {/* Add user info and logout button in header */}
          <header className="bg-white border-b border-gray-200 px-4 py-2 flex justify-end items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{username}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </header>
          {children}
        </div>
      </div>
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
      <Toaster />
    </ThemeProvider>
  )
} 