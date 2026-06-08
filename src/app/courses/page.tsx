import React from "react";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/CourseCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

// Server Component
export default async function CoursesPage() {
  const dbCourses = await db.course.findMany();
  
  // Parse JSON strings back to arrays
  const courses = dbCourses.map(c => ({
    ...c,
    tags: JSON.parse(c.tags as string),
    features: JSON.parse(c.features as string),
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Explore All Cohorts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10">
            Join thousands of students learning from the best instructors. Find the perfect course for your career goals.
          </p>
          
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <CourseCard 
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              price={`₹${course.price.toLocaleString('en-IN')}`}
              originalPrice={`₹${course.originalPrice.toLocaleString('en-IN')}`}
              tags={course.tags}
              isPopular={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
