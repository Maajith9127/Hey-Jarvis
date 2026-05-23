// Components/Common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Left - Branding */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-white">Hey Jarvis</h2>
          <p className="text-sm text-gray-400">
            Accountability & Productivity Platform
          </p>
        </div>

        {/* Right - Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
          <Link to="/about" className="hover:text-white transition">About Us</Link>
          <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
          <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
          <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Hey Jarvis. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
