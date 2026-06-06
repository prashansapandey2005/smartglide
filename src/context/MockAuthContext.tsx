"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "student" | "admin" | null;

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  purchasedCourses: string[];
}

interface MockAuthContextType {
  user: User | null;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  purchaseCourse: (courseId: string) => void;
  isLoading: boolean;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginAsStudent = () => {
    const studentUser: User = {
      name: "Student User",
      email: "student@example.com",
      role: "student",
      avatar: "https://i.pravatar.cc/150?u=student",
      purchasedCourses: [],
    };
    setUser(studentUser);
    localStorage.setItem("mockUser", JSON.stringify(studentUser));
  };

  const loginAsAdmin = () => {
    const adminUser: User = {
      name: "Admin User",
      email: "admin@educoach.com",
      role: "admin",
      avatar: "https://i.pravatar.cc/150?u=admin",
      purchasedCourses: [],
    };
    setUser(adminUser);
    localStorage.setItem("mockUser", JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  const purchaseCourse = (courseId: string) => {
    if (user && !user.purchasedCourses.includes(courseId)) {
      const updatedUser = { ...user, purchasedCourses: [...user.purchasedCourses, courseId] };
      setUser(updatedUser);
      localStorage.setItem("mockUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <MockAuthContext.Provider
      value={{ user, loginAsStudent, loginAsAdmin, logout, purchaseCourse, isLoading }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
}
