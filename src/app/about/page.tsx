"use client";

import React from "react";
import { Users, Target, BookOpen, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-24 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Our Mission is to <span className="text-indigo-600">Empower</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            EduCoach was founded with a simple goal: provide top-tier tech education that bridges the gap between college curriculum and industry expectations.
          </p>
        </div>
      </div>
      
      {/* Core Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Drives Us</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard 
            icon={<Target className="w-8 h-8 text-indigo-600" />}
            title="Industry Aligned"
            description="Our courses are designed by engineers working at top tech companies."
          />
          <ValueCard 
            icon={<Users className="w-8 h-8 text-indigo-600" />}
            title="Community First"
            description="We believe learning is a multiplayer journey. Grow with peers."
          />
          <ValueCard 
            icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
            title="Practical Focus"
            description="Less theory, more building. We focus on real-world projects."
          />
          <ValueCard 
            icon={<Sparkles className="w-8 h-8 text-indigo-600" />}
            title="Affordable"
            description="Premium education shouldn't cost a fortune. We keep it accessible."
          />
        </div>
      </div>
      
      {/* Team / Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Students collaborating" 
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The EduCoach Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Started in 2026, EduCoach began as a small YouTube channel helping students prepare for tech interviews. 
                Today, we are a comprehensive platform that has successfully placed over 10,000+ students in top tier companies globally.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We continuously evolve our curriculum to match the fast-paced tech industry, ensuring our students are always one step ahead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all">
      <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
