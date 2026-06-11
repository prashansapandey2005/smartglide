"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar: string;
  purchasedCourses: string[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  purchaseCourse: (courseId: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginAsStudent: () => {},
  loginAsAdmin: () => {},
  logout: () => {},
  purchaseCourse: () => {},
});

export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const loginAsStudent = () => {
    router.push("/login");
  };

  const loginAsAdmin = () => {
    router.push("/login");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const purchaseCourse = (courseId: string) => {
    if (user && !user.purchasedCourses.includes(courseId)) {
      const updatedUser = { ...user, purchasedCourses: [...user.purchasedCourses, courseId] };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loginAsStudent, loginAsAdmin, logout, purchaseCourse, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
}
