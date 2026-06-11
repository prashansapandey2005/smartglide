"use client";

import React, { useEffect, useState } from "react";
import { useMockAuth } from "@/context/MockAuthContext";
import { Lock, Users, CreditCard, TrendingUp, Plus, Edit, Video, FileText, CheckCircle, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { getAdminCourses, addContent, addSection, addTopic, createCourse } from "@/lib/actions";
import { UploadButton } from "@/utils/uploadthing";

export default function AdminDashboard() {
  const { user, isLoading } = useMockAuth();
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "", description: "", longDescription: "", price: "0", originalPrice: "0", instructor: "", tags: "", features: "", syllabusUrl: ""
  });

  useEffect(() => {
    setMounted(true);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const data = await getAdminCourses();
    setCourses(data);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCourse({
        ...courseForm,
        tags: courseForm.tags.split(",").map(t => t.trim()),
        features: courseForm.features.split("\n").filter(f => f.trim() !== ""),
        imageUrl: coverImageUrl,
      });
      setShowCreateCourse(false);
      await fetchCourses();
      alert("Course created successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Error creating course: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSection = async (courseId: string) => {
    const title = prompt("Enter section title:");
    if (!title) return;
    await addSection(courseId, title);
    fetchCourses();
  };

  const handleAddTopic = async (sectionId: string) => {
    const title = prompt("Enter topic title:");
    if (!title) return;
    await addTopic(sectionId, title);
    fetchCourses();
  };

  const handleContentUploadFromUrl = async (topicId: string, type: "VIDEO" | "PDF", url: string, rawName: string) => {
    const title = prompt(`Enter title for this ${type}:`, rawName) || `${type} File`;
    try {
      await addContent({ topicId, type, url, title });
      await fetchCourses();
      alert(`${type} saved successfully!`);
    } catch (err: any) {
      console.error(err);
      alert("Save failed: " + (err.message || "Server error"));
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
            <p className="text-gray-600">Manage courses, users, and build your curriculum.</p>
          </div>
          <button onClick={() => setShowCreateCourse(true)} className="px-6 py-3 bg-gray-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Course
          </button>
        </div>

        {showCreateCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
              <div className="space-y-4">
                <input required placeholder="Course Title" className="w-full p-3 border rounded-xl" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
                <input required placeholder="Instructor Name" className="w-full p-3 border rounded-xl" value={courseForm.instructor} onChange={e => setCourseForm({...courseForm, instructor: e.target.value})} />
                <textarea required placeholder="Short Description" className="w-full p-3 border rounded-xl" value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
                <textarea required placeholder="Long Description" className="w-full p-3 border rounded-xl h-32" value={courseForm.longDescription} onChange={e => setCourseForm({...courseForm, longDescription: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price (₹)" className="w-full p-3 border rounded-xl" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} />
                  <input required type="number" placeholder="Original Price (₹)" className="w-full p-3 border rounded-xl" value={courseForm.originalPrice} onChange={e => setCourseForm({...courseForm, originalPrice: e.target.value})} />
                </div>
                <input placeholder="Tags (comma separated)" className="w-full p-3 border rounded-xl" value={courseForm.tags} onChange={e => setCourseForm({...courseForm, tags: e.target.value})} />
                <textarea placeholder="Features (one per line)" className="w-full p-3 border rounded-xl" value={courseForm.features} onChange={e => setCourseForm({...courseForm, features: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Course Cover Image (Optional)</label>
                    {coverImageUrl ? (
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <img src={coverImageUrl} alt="Cover" className="h-12 w-16 object-cover rounded" />
                        <button type="button" onClick={() => setCoverImageUrl(null)} className="text-sm font-medium text-red-600 hover:text-red-700">Remove</button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <UploadButton
                          endpoint="courseImage"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]) setCoverImageUrl(res[0].url);
                          }}
                          onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                          appearance={{ button: { background: '#4f46e5' } }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Course Syllabus PDF (Optional)</label>
                    {courseForm.syllabusUrl ? (
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <FileText className="w-8 h-8 text-orange-500" />
                        <span className="text-sm text-gray-600 flex-1 truncate">Syllabus uploaded</span>
                        <button type="button" onClick={() => setCourseForm({...courseForm, syllabusUrl: ""})} className="text-sm font-medium text-red-600 hover:text-red-700">Remove</button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <UploadButton
                          endpoint="coursePdf"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]) setCourseForm({...courseForm, syllabusUrl: res[0].url});
                          }}
                          onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                          appearance={{ button: { background: '#f97316' } }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowCreateCourse(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">{isSubmitting ? "Creating..." : "Create Course"}</button>
              </div>
            </form>
          </div>
        )}

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

        <div className="space-y-8">
          {courses.length === 0 && <div className="bg-white p-8 rounded-3xl text-center text-gray-500 border border-gray-200">No courses found in database.</div>}
          
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {course.imageUrl ? <img src={course.imageUrl} className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center"><BookOpen className="w-6 h-6 text-gray-500" /></div>}
                  <div>
                    <h2 className="text-xl font-bold">{course.title}</h2>
                    <p className="text-sm text-gray-400">Instructor: {course.instructor} • ₹{course.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAddSection(course.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors">
                    + Add Section
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50/50">
                {course.sections.length === 0 && <div className="text-center p-4 text-gray-500">No sections added yet.</div>}
                
                <div className="space-y-6">
                  {course.sections.map((section: any) => (
                    <div key={section.id} className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg">{section.title}</h3>
                        <button onClick={() => handleAddTopic(section.id)} className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
                          + Add Topic
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        {section.topics.length === 0 && <div className="text-sm text-gray-400 italic">No topics in this section.</div>}
                        
                        {section.topics.map((topic: any) => (
                          <div key={topic.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                              <h4 className="font-semibold text-gray-800">{topic.title}</h4>
                              <div className="flex flex-wrap gap-4 items-center">
                                <div className="bg-white p-2 border rounded-xl shadow-sm">
                                  <span className="text-xs font-bold text-indigo-500 mb-1 block uppercase tracking-wider">+ Video Upload</span>
                                  <UploadButton
                                    endpoint="courseVideo"
                                    onClientUploadComplete={(res) => {
                                      if(res?.[0]) handleContentUploadFromUrl(topic.id, "VIDEO", res[0].url, res[0].name);
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`ERROR! ${error.message}`);
                                    }}
                                    appearance={{ button: { padding: '4px 8px', fontSize: '12px' } }}
                                  />
                                </div>
                                <div className="bg-white p-2 border rounded-xl shadow-sm">
                                  <span className="text-xs font-bold text-orange-500 mb-1 block uppercase tracking-wider">+ PDF Upload</span>
                                  <UploadButton
                                    endpoint="coursePdf"
                                    onClientUploadComplete={(res) => {
                                      if(res?.[0]) handleContentUploadFromUrl(topic.id, "PDF", res[0].url, res[0].name);
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`ERROR! ${error.message}`);
                                    }}
                                    appearance={{ button: { padding: '4px 8px', fontSize: '12px', background: '#f97316' } }}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Contents inside topic */}
                            <div className="space-y-2 mt-4">
                              {topic.contents?.length === 0 && <div className="text-xs text-gray-400">No content uploaded yet.</div>}
                              {topic.contents?.map((content: any) => (
                                <div key={content.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2.5 text-sm">
                                  {content.type === "VIDEO" ? <Video className="w-4 h-4 text-indigo-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                                  <span className="font-medium text-gray-700 flex-1">{content.title}</span>
                                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Uploaded</span>
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
          ))}
        </div>
        
      </div>
    </div>
  );
}
