import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
        {/* Left Section */}
        <div>
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-2">Get in touch</h2>
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            We are always ready to help you and answer your questions
          </h1>
          <p className="text-gray-600 mb-8">
            Hey Jarvis is an accountability and productivity platform that helps
            individuals stay consistent with their goals through scheduled tasks,
            live verification (photo/video), and penalty-based systems.
          </p>
          <div className="grid grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Call Center</h3>
              <p>+91-9042662714</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Our Location</h3>
              <p>New Street, Kadayanallur, Tenkasi, Tamil Nadu, India</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p>maajithanas@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white shadow-md rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Define your goals and identify areas where Hey Jarvis can add value to your life.
          </p>
          <form className="space-y-4">
            <input type="text" placeholder="Full name" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Subject" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Message" rows="4" className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
              Send a message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
