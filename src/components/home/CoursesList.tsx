"use client";

import { useEffect, useState } from "react";
import { getPopularCourses } from "@/lib/actions";
import { BuyCourseButton } from "@/components/payments/BuyCourseButton";
import { BookOpen, Star, Clock } from "lucide-react";

export function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getPopularCourses();
        setCourses(fetchedCourses);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading newest courses...</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>Database Error:</p>
        <p className="font-mono text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Popular <span className="text-blue-600">Courses</span>
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Learn from the best. Hands-on projects, premium support, and high-quality video content.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-12 rounded-3xl shadow-sm">
            <p>No courses available right now. Admins can add courses from the dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    Bestseller
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-500 mb-6 flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-8 border-t border-gray-100 pt-6">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Complete Module
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Lifetime Access
                  </div>
                </div>

                <div className="mt-auto">
                  <BuyCourseButton courseId={course.id} price={course.price} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
