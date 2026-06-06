"use client";

import React, { useState, useEffect } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { getCourseWithSyllabus } from "@/lib/actions";

export default function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useMockAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  useEffect(() => {
    params.then(async (resolvedParams) => {
      const fetchedCourse = await getCourseWithSyllabus(resolvedParams.id);
      setCourse(fetchedCourse);
      
      // Auto-select the first topic of the first section if available
      if (fetchedCourse && fetchedCourse.sections.length > 0 && fetchedCourse.sections[0].topics.length > 0) {
        setSelectedTopic(fetchedCourse.sections[0].topics[0]);
      }
    });
  }, [params]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !course) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Course Data...</div>;

  const hasPurchased = user?.purchasedCourses?.includes(course.id);

  if (!user || user.role !== "student" || !hasPurchased) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <Lock className="w-16 h-16 text-gray-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">You must enroll in this course to view the content.</p>
        <Link href={`/courses/${course.id}`} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
          View Course Details
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 pt-16">
      <div className="flex h-[calc(100vh-64px)]">
        
        {/* Main Video Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center gap-4 bg-gray-900 border-b border-gray-800 shrink-0">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-white line-clamp-1">{course.title}</h1>
          </div>

          {/* Secure Video Player */}
          <div className="flex-1 relative aspect-video bg-gray-900 flex items-center justify-center border-b border-gray-800 max-h-[70vh]">
            {selectedTopic?.videoUrl ? (
              <video 
                src={`/api/stream/${selectedTopic.videoUrl}`} 
                controls 
                controlsList="nodownload" 
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-contain bg-black"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-800/50">
                <PlayCircle className="w-20 h-20 mb-4 opacity-50" />
                <p className="font-medium text-lg">No Video Available</p>
                <p className="text-sm mt-2 opacity-75">The instructor has not uploaded a video for this topic yet.</p>
              </div>
            )}
          </div>

          {/* Video Details & Resources */}
          <div className="p-8 bg-gray-900 shrink-0">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedTopic ? selectedTopic.title : "Select a topic from the syllabus"}
            </h2>
            <p className="text-gray-400 mb-8 max-w-3xl">
              Focus on this topic and ensure you have completed the materials before moving on to the next.
            </p>
            
            <div className="flex gap-4 border-t border-gray-800 pt-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 text-indigo-400" /> Download PDF Notes
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Syllabus */}
        <div className="w-80 lg:w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto shrink-0 hidden md:block">
          <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
            <h3 className="font-bold text-white mb-2">Course Content</h3>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-800">
            {course.sections.map((section: any, idx: number) => (
              <div key={section.id} className="bg-gray-900">
                <div className="p-4 font-bold text-sm text-gray-300 bg-gray-800/50">
                  Section {idx + 1}: {section.title}
                </div>
                <div>
                  {section.topics.map((topic: any) => {
                    const isSelected = selectedTopic?.id === topic.id;
                    return (
                      <button 
                        key={topic.id} 
                        onClick={() => setSelectedTopic(topic)}
                        className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-800 transition-colors ${isSelected ? "bg-gray-800 border-l-2 border-indigo-500" : ""}`}
                      >
                        {isSelected ? (
                          <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${isSelected ? "text-white" : "text-gray-400"}`}>{topic.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
