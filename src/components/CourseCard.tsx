"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useMockAuth } from "@/context/MockAuthContext";
import { useRouter } from "next/navigation";

export function CourseCard({ id, title, description, price, originalPrice, tags, isPopular = false }: any) {
  const { user, purchaseCourse } = useMockAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="relative bg-white rounded-3xl border border-gray-200 overflow-hidden group hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
      {isPopular && (
        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}
      
      <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <BookOpen className="w-20 h-20 text-indigo-200" />
      </div>
      
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string) => (
            <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-700 font-medium">Lifetime Access</span>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div>
            <span className="text-3xl font-extrabold text-gray-900">{price}</span>
            <span className="text-sm text-gray-400 line-through ml-2">{originalPrice}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/courses/${id}`} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors text-sm">
              Details
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  alert("Please login first to enroll in this course.");
                  return;
                }
                setIsProcessing(true);
                setTimeout(() => {
                  purchaseCourse(id);
                  setIsProcessing(false);
                  router.push("/dashboard");
                }, 1000);
              }}
              disabled={isProcessing}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Enrolling..." : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
