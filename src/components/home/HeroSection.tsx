"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const typingTexts = [
  "Sigma - DSA + Web Development",
  "Alpha - Master DSA",
  "Delta - Full Stack Development"
];

export function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = typingTexts[textIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && displayText === currentFullText) {
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        currentFullText.substring(0, displayText.length + (isDeleting ? -1 : 1))
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Learn from the best. <br />
                <span className="text-blue-600 inline-block min-h-[1.2em]">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto md:mx-0">
                Join the most structured and comprehensive programming courses to crack your dream job.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 shadow-xl shadow-blue-500/30">
                  Ultimate Placement Solution
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-md mx-auto aspect-[3/4]"
            >
              {/* Decorative blob behind */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-t-full transform scale-105 -z-10"></div>
              
              {/* Arched image container */}
              <div className="w-full h-full rounded-t-full overflow-hidden border-8 border-white shadow-2xl bg-gray-100 relative">
                {/* Dummy Mentor Image */}
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Mentor"
                  className="object-cover w-full h-full object-top"
                />
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 border border-gray-100"
              >
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">New Batch</p>
                  <p className="text-sm font-bold text-gray-900">Starts Today</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
