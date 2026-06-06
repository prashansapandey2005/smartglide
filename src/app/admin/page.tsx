"use client";

import React, { useEffect, useState } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import { Lock, Users, CreditCard, TrendingUp, Plus, Edit, Video, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAdminCourses, uploadVideoToTopic, uploadVideoAction } from "@/lib/actions";

export default function AdminDashboard() {
  const { user, isLoading } = useMockAuth();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [uploadingTopic, setUploadingTopic] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const data = await getAdminCourses();
    setCourses(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, topicId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTopic(topicId);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use Next.js Server Action to bypass standard API route limits
      await uploadVideoAction(formData, topicId);
      
      await fetchCourses();
      alert("Video uploaded and secured successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + (err.message || "Server error"));
    } finally {
      setUploadingTopic(null);
    }
  };

  if (!mounted || isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600"/></div>;

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <Lock className="w-16 h-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have administrator privileges to view this page.</p>
        <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium">
          Go Home
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: "12,450", icon: <Users className="w-6 h-6 text-indigo-600" />, trend: "+12%" },
    { label: "Active Enrollments", value: "8,210", icon: <CreditCard className="w-6 h-6 text-blue-600" />, trend: "+5%" },
    { label: "Total Revenue", value: "₹4.2Cr", icon: <TrendingUp className="w-6 h-6 text-green-600" />, trend: "+18%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage courses, users, and upload securely protected videos.</p>
          </div>
          <button className="px-6 py-3 bg-gray-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <span className="text-sm font-bold text-green-500">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Manage Course Videos</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {courses.length === 0 && <div className="p-8 text-center text-gray-500">No courses found in database.</div>}
            
            {courses.map((course) => (
              <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent">
                    <Edit className="w-5 h-5" />
                  </button>
                </div>

                <div className="pl-4 border-l-2 border-indigo-100 mt-2 space-y-4">
                  {course.sections.map((section: any) => (
                    <div key={section.id}>
                      <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{section.title}</h4>
                      <div className="space-y-2">
                        {section.topics.map((topic: any) => (
                          <div key={topic.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <span className="text-sm font-medium text-gray-800">{topic.title}</span>
                            
                            <div className="flex items-center gap-3">
                              {topic.videoUrl ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                  <CheckCircle className="w-3.5 h-3.5" /> Video Uploaded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                  Missing Video
                                </span>
                              )}

                              <label className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 border ${topic.videoUrl ? 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'}`}>
                                {uploadingTopic === topic.id ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                ) : (
                                  <><Video className="w-4 h-4" /> {topic.videoUrl ? 'Replace Video' : 'Upload Video'}</>
                                )}
                                <input 
                                  type="file" 
                                  accept="video/*" 
                                  className="hidden" 
                                  onChange={(e) => handleFileUpload(e, topic.id)}
                                  disabled={uploadingTopic !== null}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
