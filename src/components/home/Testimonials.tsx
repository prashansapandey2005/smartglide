"use client";

import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Software Engineer",
      company: "Google",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      branch: "Computer Science",
      degree: "B.Tech",
      batch: "2023",
      ctc: "45 LPA",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "SDE-1",
      company: "Amazon",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      branch: "Information Technology",
      degree: "B.E",
      batch: "2023",
      ctc: "32 LPA",
      gradient: "from-orange-400 to-pink-500",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Frontend Developer",
      company: "Microsoft",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      image: "https://randomuser.me/api/portraits/men/86.jpg",
      branch: "Electronics",
      degree: "B.Tech",
      batch: "2022",
      ctc: "40 LPA",
      gradient: "from-green-400 to-emerald-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our Wall of <span className="text-blue-600">Fame</span>
          </h2>
          <p className="text-xl text-gray-600">Read what our successful students have to say</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-8">
          {testimonials.map((t) => (
            <div key={t.id} className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
              {/* Top Gradient Area */}
              <div className={`h-32 rounded-t-3xl bg-gradient-to-r ${t.gradient} flex items-center justify-center`}>
                <div className="text-white text-center px-4">
                  <p className="font-bold text-lg">{t.role}</p>
                  <p className="text-sm opacity-90">Placed at {t.company}</p>
                </div>
              </div>

              {/* Profile Image (Overlapping) */}
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Bottom White Area */}
              <div className="pt-16 pb-8 px-6 text-center">
                <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                
                <div className="flex justify-center mt-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-6 text-left bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="font-semibold text-gray-900">Degree:</span> {t.degree}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Branch:</span> {t.branch}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Batch:</span> {t.batch}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">CTC:</span> <span className="text-green-600 font-bold">{t.ctc}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center h-8">
                  <img src={t.companyLogo} alt={t.company} className="max-h-full max-w-[100px] object-contain grayscale opacity-60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
