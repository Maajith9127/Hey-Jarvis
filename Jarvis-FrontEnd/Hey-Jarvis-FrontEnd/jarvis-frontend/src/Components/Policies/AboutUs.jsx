import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">About Us</h1>

        <p className="text-gray-700 mb-4">
          Hey Jarvis is an accountability and productivity platform designed to help individuals
          stay consistent with their goals. By combining task scheduling, live verification
          (photo/video), and penalty-based systems, we make discipline easier and more reliable.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          Our mission is simple: to help people build habits, achieve goals, and unlock their full
          potential. We believe that accountability is the key to long-term success, and Hey Jarvis
          provides the tools to make it practical and effective.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Who We Are</h2>
        <p className="text-gray-700 mb-4">
          Hey Jarvis is created and operated by <strong>Maajith A</strong>, based in
          Tamil Nadu, India. With a passion for software development and real-world problem-solving,
          we are committed to delivering a reliable and secure platform.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Service Delivery</h2>
        <p className="text-gray-700 mb-4">
          Hey Jarvis is a digital SaaS platform. Services are delivered instantly upon
          account creation and can be accessed online anytime. All applicable penalties
          and charges are displayed to users upfront before confirmation.
        </p>

        <p className="text-gray-700 mt-8">
          Thank you for trusting Hey Jarvis. Together, we aim to create a future where discipline
          and productivity become second nature.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
