"use client";

import React, { useEffect, useState } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import Link from "next/link";
import { PlayCircle, CheckCircle2, Lock, BookOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPurchasedCourses } from "@/lib/actions";

export default function StudentDashboard() {
  const { user, isLoading } = useMockAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [purchasedCourseData, setPurchasedCourseData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && user.role === "student" && user.purchasedCourses.length > 0) {
      getPurchasedCourses(user.purchasedCourses).then(data => {
        setPurchasedCourseData(data);
        setIsFetching(false);
      });
    } else {
      setIsFetching(false);
    }
  }, [user]);

  if (!mounted || isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <Lock className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please login as a student to view your dashboard.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Pick up where you left off and keep learning.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
        
        {isFetching ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : purchasedCourseData.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses. Explore our catalog and start your coding journey today!
            </p>
            <Link href="/courses" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchasedCourseData.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <BookOpen className="w-12 h-12 text-indigo-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Instructor: {course.instructor}</span>
                  </div>
                  
                  {/* Mock Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>

                  <Link href={`/learn/${course.id}`} className="w-full py-3 bg-gray-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
