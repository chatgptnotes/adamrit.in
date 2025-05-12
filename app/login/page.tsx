"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivitySquare, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Demo credentials (in a real app, this would be validated by your backend)
      if (username === "admin" && password === "password") {
        // Store login state in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        
        // Redirect to dashboard
        router.push("/");
      } else {
        setError("Invalid username or password. Try admin/password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-2">
            <ActivitySquare className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Hope Hospital</h1>
          <p className="text-gray-500 mt-2">Hospital Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to your account</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Demo credentials: admin / password</p>
          </div>
        </form>
      </div>
    </div>
  );
} 