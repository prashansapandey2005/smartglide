import React from "react";
import Link from "next/link";
import { Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">EduCoach</span>
            </Link>
            <p className="text-gray-500 text-sm">
              The ultimate platform to learn coding, crack placements, and build your dream career.
            </p>
            <div className="flex gap-4 mt-6 text-sm font-medium">
              <a href="#" className="text-gray-400 hover:text-indigo-600">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">YouTube</a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">GitHub</a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Courses</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-sm text-gray-500 hover:text-indigo-600">Web Development</Link></li>
              <li><Link href="/courses" className="text-sm text-gray-500 hover:text-indigo-600">Data Structures</Link></li>
              <li><Link href="/courses" className="text-sm text-gray-500 hover:text-indigo-600">System Design</Link></li>
              <li><Link href="/courses" className="text-sm text-gray-500 hover:text-indigo-600">Interview Prep</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-indigo-600">About Us</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Careers</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Blog</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-500 hover:text-indigo-600">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduCoach. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
