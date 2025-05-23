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
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check user in Supabase
    const { data: user, error: supaError } = await supabase
      .from("user")
      .select("*")
      .eq("email", form.email)
      .eq("password", form.password) // Note: In production, use hashed passwords!
        .single();
      
    if (supaError || !user) {
        setError("Invalid email or password");
        return;
      }
         
    // Set login status in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user.full_name || user.email);
      
    // Redirect to home/dashboard
    router.push("/");
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
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full"
              // disabled={true}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center" 
            >
              Login
            </Button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <p className="text-gray-500 mb-2">Don't have an account?</p>
            <a 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 border border-blue-300 rounded-md inline-block"
            >
              Register Now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 