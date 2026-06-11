import React from "react";
import { notFound } from "next/navigation";
import { BookOpen, CheckCircle2, PlayCircle, FileText, Award, Clock } from "lucide-react";
import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";
import { getCourseWithSyllabus } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dbCourse = await getCourseWithSyllabus(resolvedParams.id);
  
  if (!dbCourse) {
    notFound();
  }

  // Parse JSON arrays for the UI
  const course: any = {
    ...dbCourse,
    tags: JSON.parse(dbCourse.tags as string),
    features: JSON.parse(dbCourse.features as string),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Course Header */}
      <div className="bg-gray-900 text-white pt-24 pb-32 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map((tag: string) => (
                  <span key={tag} className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                    {course.instructor.charAt(0)}
                  </div>
                  <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-400" />
                  <span>On-Demand Video</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
            
            {/* Pricing Card (Desktop - Floats over the header) */}
            <div className="lg:w-1/3 hidden lg:block">
              <PricingCard course={course} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            
            {/* Mobile Pricing Card */}
            <div className="lg:hidden mb-12">
              <PricingCard course={course} />
            </div>

            {/* About Course */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Course</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {course.longDescription}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {course.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Syllabus */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  Course Syllabus
                </h2>
                {course.syllabusUrl && (
                  <a 
                    href={course.syllabusUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-medium transition-colors border border-indigo-100"
                  >
                    <FileText className="w-4 h-4" /> Download PDF
                  </a>
                )}
              </div>
              
              <div className="space-y-6">
                {course.sections.map((section: any, idx: number) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {idx + 1}
                      </span>
                      {section.title}
                    </h3>
                    <ul className="space-y-3 pl-11">
                      {section.topics.map((topic: any, tIdx: number) => (
                        <li key={tIdx} className="flex items-center gap-3 text-gray-600">
                          <PlayCircle className="w-4 h-4 text-gray-400" />
                          {topic.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            
          </div>
          
          <div className="lg:w-1/3 hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
}
