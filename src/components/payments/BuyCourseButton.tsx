"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface BuyCourseButtonProps {
  courseId: string;
  price: number;
}

export function BuyCourseButton({ courseId, price }: BuyCourseButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    try {
      // 1. Create order on our backend
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, amount: price, userId: user.uid }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "dummy_key", 
        amount: data.order.amount,
        currency: "INR",
        name: "Apna College Clone",
        description: "Course Purchase",
        order_id: data.order.id,
        handler: function (response: any) {
          // Razorpay returns payment_id, order_id, signature. 
          // The Webhook on the backend will actually unlock the course!
          alert("Payment Successful! Your course is now unlocked.");
          router.push("/lms");
        },
        prefill: {
          email: user.email,
          name: user.displayName,
        },
        theme: {
          color: "#2563EB", // Blue-600
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong initializing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Enroll Now for ₹${price}`}
      </button>
    </>
  );
}
