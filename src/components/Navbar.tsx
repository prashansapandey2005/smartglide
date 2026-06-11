"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMockAuth } from "@/context/MockAuthContext";
import { Menu, X, Code, BookOpen, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, loginAsStudent, loginAsAdmin, logout, isLoading } = useMockAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EduCoach</span>
          </Link>

          {/* Persistent Hamburger Menu Button (Always Visible) */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right-Side Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-64 sm:w-80 h-full bg-white shadow-2xl flex flex-col transform transition-transform" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              <Link href="/courses" className="text-lg font-medium text-gray-700 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
              <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              {isLoading ? (
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-300" />
                    <div>
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  {user.role === 'admin' ? (
                    <Link href="/admin" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings className="w-5 h-5 text-indigo-500" /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      <LayoutDashboard className="w-5 h-5 text-indigo-500" /> My Courses
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium mt-2"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
