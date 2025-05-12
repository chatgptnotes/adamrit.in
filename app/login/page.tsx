"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActivitySquare, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      // Check if user exists with provided email and password
      const { data, error } = await supabase
        .from('user_register')
        .select('*')
        .eq('email', credentials.email)
        .eq('password', credentials.password)  // In a real app, use proper password hashing!
        .single();
      
      if (error || !data) {
        setError("Invalid email or password");
        return;
      }
      
      // In a real app, you would now set a session or token
      // For simplicity, we'll just redirect to the home page
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        is_verified: data.is_verified
      }));
      
      // Redirect to home page
      router.push('/');
      
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
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
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to your account</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full"
              disabled={loading}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full"
              disabled={loading}
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
              disabled={loading}
            >
              {loading ? (
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