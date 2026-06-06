"use client";

import React, { useState, useEffect } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock, ChevronDown, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { getCourseWithSyllabus } from "@/lib/actions";

export default function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading } = useMockAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<any>(null);

  useEffect(() => {
    params.then(async (resolvedParams) => {
      const fetchedCourse: any = await getCourseWithSyllabus(resolvedParams.id);
      setCourse(fetchedCourse);
      
      // Auto-select the first content of the first topic if available
      if (fetchedCourse?.sections?.[0]?.topics?.[0]) {
        setExpandedTopic(fetchedCourse.sections[0].topics[0].id);
        const firstContent = fetchedCourse.sections[0].topics[0].contents?.[0];
        if (firstContent) setActiveContent(firstContent);
      }
    });
  }, [params]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !course) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div></div>;

  const hasPurchased = user?.role === "admin" || user?.purchasedCourses?.includes(course.id);

  if (!user || (!hasPurchased && user.role !== "admin")) {
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
        
        {/* Main Viewer Area */}
        <div className="flex-1 overflow-y-auto bg-black flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center gap-4 bg-gray-900 border-b border-gray-800 shrink-0">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-white line-clamp-1">{course.title}</h1>
          </div>

          {/* Secure Content Viewer */}
          <div className="flex-1 relative bg-gray-900 flex flex-col border-b border-gray-800">
            {activeContent ? (
              activeContent.type === "VIDEO" ? (
                <div className="flex-1 relative aspect-video flex items-center justify-center max-h-[70vh]">
                  <video 
                    src={`/api/stream/${activeContent.url}`} 
                    controls 
                    controlsList="nodownload" 
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-800/50">
                  <FileText className="w-24 h-24 text-orange-500 mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">{activeContent.title}</h2>
                  <p className="text-gray-400 mb-8 max-w-md">This is a PDF document. You can download it below to view it.</p>
                  <a href={`/api/stream/${activeContent.url}`} download={`${activeContent.title}.pdf`} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors">
                    <Download className="w-5 h-5" /> Download PDF Notes
                  </a>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-800/50">
                <PlayCircle className="w-20 h-20 mb-4 opacity-50" />
                <p className="font-medium text-lg">No Content Selected</p>
                <p className="text-sm mt-2 opacity-75">Select a video or notes from the syllabus sidebar to begin.</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 bg-gray-900 shrink-0">
            <h2 className="text-2xl font-bold text-white mb-4">
              {activeContent ? activeContent.title : "Select content to view details"}
            </h2>
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
                <div className="p-4 font-bold text-sm text-gray-300 bg-gray-800/50 border-b border-gray-800/50">
                  Section {idx + 1}: {section.title}
                </div>
                <div className="divide-y divide-gray-800/30">
                  {section.topics.map((topic: any) => {
                    const isExpanded = expandedTopic === topic.id;
                    return (
                      <div key={topic.id}>
                        <button 
                          onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors ${isExpanded ? "bg-gray-800" : ""}`}
                        >
                          <span className="text-sm font-semibold text-gray-200">{topic.title}</span>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="bg-gray-900 pb-2">
                            {topic.contents?.length === 0 && <div className="px-8 py-3 text-xs text-gray-500 italic">No content in this topic.</div>}
                            {topic.contents?.map((content: any) => {
                              const isSelected = activeContent?.id === content.id;
                              return (
                                <button 
                                  key={content.id}
                                  onClick={() => setActiveContent(content)}
                                  className={`w-full text-left pl-8 pr-4 py-2.5 flex items-start gap-3 hover:bg-gray-800 transition-colors ${isSelected ? "border-l-2 border-indigo-500 bg-gray-800/80" : "border-l-2 border-transparent"}`}
                                >
                                  {content.type === "VIDEO" ? (
                                    <PlayCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-indigo-400" : "text-gray-500"}`} />
                                  ) : (
                                    <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-orange-400" : "text-gray-500"}`} />
                                  )}
                                  <span className={`text-sm ${isSelected ? "text-white font-medium" : "text-gray-400"}`}>
                                    {content.title}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
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
