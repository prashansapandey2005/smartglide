"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Trophy, Users, Star, PlayCircle } from "lucide-react";
import { courses } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.03]"></div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-medium text-sm mb-8 border border-indigo-100">
              <Star className="w-4 h-4 fill-current" />
              <span>India's Most Loved Coding Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Coding</span><br />
              <span className="text-4xl md:text-6xl text-gray-700">Crack Top Placements</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Master Data Structures, Web Development, and System Design with highly structured, cohort-based learning.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group">
                Explore Courses 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all shadow-sm border border-gray-200 flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                Watch Intro
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100k+</div>
              <div className="text-sm font-medium text-gray-500">Students Enrolled</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-sm font-medium text-gray-500">Companies Hiring</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-sm font-medium text-gray-500">Average Rating</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">₹12LPA</div>
              <div className="text-sm font-medium text-gray-500">Average Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EduCoach?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to succeed in your tech career journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Code className="h-6 w-6 text-indigo-600" />}
              title="Structured Curriculum"
              description="Step-by-step learning paths designed by industry experts to take you from zero to hero."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-indigo-600" />}
              title="Community Support"
              description="Join our private Discord groups. Learn together, build together, and grow your network."
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-indigo-600" />}
              title="Placement Assistance"
              description="Resume reviews, mock interviews, and direct referrals to top tech companies."
            />
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Cohorts</h2>
              <p className="text-lg text-gray-600">Start learning today.</p>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {courses.slice(0, 2).map((course) => (
              <CourseCard 
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                price={`₹${course.price.toLocaleString('en-IN')}`}
                originalPrice={`₹${course.originalPrice.toLocaleString('en-IN')}`}
                tags={course.tags}
                isPopular={course.isPopular}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}


