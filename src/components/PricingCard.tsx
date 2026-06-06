"use client";

import React, { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { useMockAuth } from "@/context/MockAuthContext";
import { useRouter } from "next/navigation";

export function PricingCard({ course }: { course: any }) {
  const { user, purchaseCourse } = useMockAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnroll = () => {
    if (!user) {
      alert("Please login first to enroll in this course.");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      purchaseCourse(course.id);
      setIsProcessing(false);
      router.push("/dashboard");
    }, 1500);
  };

  const hasPurchased = user?.purchasedCourses?.includes(course.id);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden flex items-center justify-center rounded-2xl mb-8 border border-gray-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <BookOpen className="w-16 h-16 text-indigo-200" />
      </div>
      
      <div className="mb-8">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-extrabold text-gray-900">₹{course.price.toLocaleString('en-IN')}</span>
          <span className="text-xl text-gray-400 line-through pb-1">₹{course.originalPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-green-600 text-sm font-bold bg-green-50 inline-block px-3 py-1 rounded-full border border-green-200">
          Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% Today
        </div>
      </div>
      
      {hasPurchased ? (
        <button 
          onClick={() => router.push("/dashboard")}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-md shadow-green-200 mb-4 flex items-center justify-center gap-2 text-lg"
        >
          Go to Course
        </button>
      ) : (
        <button 
          onClick={handleEnroll}
          disabled={isProcessing}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 mb-4 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enroll Now"}
        </button>
      )}
      
      <p className="text-center text-sm text-gray-500 font-medium">
        30-Day Money-Back Guarantee
      </p>
    </div>
  );
}
