export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  tags: string[];
  isPopular?: boolean;
  instructor: string;
  syllabus: { title: string; topics: string[] }[];
  features: string[];
}

export const courses: Course[] = [
  {
    id: "alpha-full-stack",
    title: "Alpha Batch: Full Stack Web Dev",
    description: "Master MERN Stack, Next.js, and build production-ready applications.",
    longDescription: "The most comprehensive Full Stack Web Development bootcamp. You will learn everything from HTML, CSS, JavaScript to advanced React, Node.js, Express, MongoDB, and Next.js. We will build 5+ production-grade projects including an e-commerce platform and a social media clone.",
    price: 3499,
    originalPrice: 6999,
    tags: ["Web Dev", "React", "Node.js", "Next.js"],
    isPopular: true,
    instructor: "Shradha Khapra",
    features: [
      "300+ Hours of Video Lectures",
      "5 Real-world Projects",
      "Dedicated Discord Community",
      "Doubt Assistance",
      "Certificate of Completion",
      "Lifetime Access"
    ],
    syllabus: [
      { title: "HTML & CSS Foundation", topics: ["HTML5 Tags", "CSS Selectors", "Flexbox & Grid", "Responsive Design"] },
      { title: "JavaScript Mastery", topics: ["ES6+ Features", "DOM Manipulation", "Async/Await", "API Fetching"] },
      { title: "React.js & Frontend", topics: ["Components", "Hooks", "State Management", "Routing", "Tailwind CSS"] },
      { title: "Backend & Databases", topics: ["Node.js Basics", "Express Servers", "MongoDB", "Mongoose", "Authentication (JWT)"] },
      { title: "Advanced Topics", topics: ["Next.js App Router", "Server Components", "Deployment (Vercel)"] }
    ]
  },
  {
    id: "sigma-dsa",
    title: "Sigma Batch: DSA & System Design",
    description: "Crack top product-based companies with intense problem-solving skills.",
    longDescription: "A rigorous program designed to make you an expert in Data Structures, Algorithms, and System Design. Perfect for students preparing for FAANG and top-tier product-based company interviews.",
    price: 4999,
    originalPrice: 8999,
    tags: ["C++", "Java", "DSA", "Interviews"],
    isPopular: true,
    instructor: "Aman Dhattarwal",
    features: [
      "400+ Coding Problems",
      "Language Support (C++ & Java)",
      "System Design (LLD & HLD)",
      "Mock Interviews",
      "Placement Referrals",
      "Lifetime Access"
    ],
    syllabus: [
      { title: "Basics of Programming", topics: ["Variables", "Loops", "Functions", "Arrays & Strings"] },
      { title: "Core Data Structures", topics: ["Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Hashing"] },
      { title: "Advanced Algorithms", topics: ["Dynamic Programming", "Greedy Algorithms", "Backtracking", "Tries"] },
      { title: "System Design basics", topics: ["Scalability", "Load Balancing", "Microservices", "Caching"] }
    ]
  },
  {
    id: "java-foundation",
    title: "Java Programming Masterclass",
    description: "Learn Java from scratch. Perfect for absolute beginners.",
    longDescription: "Start your coding journey with Java. This course covers everything from basic syntax to Object-Oriented Programming principles. By the end, you'll be writing complex Java applications.",
    price: 1999,
    originalPrice: 3999,
    tags: ["Java", "Beginner", "OOPs"],
    isPopular: false,
    instructor: "Shradha Khapra",
    features: [
      "100+ Hours of Video",
      "Quizzes & Assignments",
      "Certificate of Completion",
      "Lifetime Access"
    ],
    syllabus: [
      { title: "Getting Started", topics: ["Installation", "Hello World", "Variables & Data Types"] },
      { title: "Control Flow", topics: ["If-Else", "Switch Case", "For & While Loops"] },
      { title: "Object Oriented Programming", topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation"] },
      { title: "Advanced Java", topics: ["Collections Framework", "Exception Handling", "File I/O"] }
    ]
  }
];
