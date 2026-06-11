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
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EduCoach</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Courses</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</Link>
            
            <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
              {isLoading ? (
                <div className="flex gap-3">
                  <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="w-24 h-9 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              ) : user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                      {user.role === 'admin' ? (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                          <Settings className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" /> My Courses
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={loginAsStudent}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    Login (Student)
                  </button>
                  <button 
                    onClick={loginAsAdmin}
                    className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Login (Admin)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
            <Link href="/courses" className="text-gray-700 font-medium px-2 py-1">Courses</Link>
            <Link href="/about" className="text-gray-700 font-medium px-2 py-1">About</Link>
            
            <div className="h-px bg-gray-200 w-full my-2"></div>
            
            {isLoading ? (
              <div className="flex flex-col gap-3 px-2">
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                  <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                {user.role === 'admin' ? (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium px-2 py-1 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Admin Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium px-2 py-1 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> My Courses
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-red-600 font-medium px-2 py-1 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => { loginAsStudent(); setIsMobileMenuOpen(false); }} className="w-full text-center bg-gray-50 text-gray-800 font-medium py-2 rounded-lg border border-gray-200">
                  Login as Student
                </button>
                <button onClick={() => { loginAsAdmin(); setIsMobileMenuOpen(false); }} className="w-full text-center bg-indigo-600 text-white font-medium py-2 rounded-lg">
                  Login as Admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
