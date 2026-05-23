import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          Hey Jarvis respects your privacy and is committed to protecting your personal data.
          This Privacy Policy explains how we collect, use, and safeguard your information
          when you use our accountability and productivity platform.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
          <li>User profile details (name, email, phone number).</li>
          <li>Verification data (live photos, videos, scheduled tasks).</li>
          <li>Payment details processed securely via Cashfree.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. How We Use Information</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
          <li>To verify user activities through live photo/video challenges.</li>
          <li>To process accountability penalties and transactions.</li>
          <li>To improve our services and provide reminders, reports, and notifications.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Data Protection</h2>
        <p className="text-gray-700 mb-4">
          We use industry-standard encryption and secure storage to protect your information.
          Your data will never be sold or shared with third parties, except for trusted
          partners like Cashfree for payment processing.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. User Rights</h2>
        <p className="text-gray-700 mb-4">
          You may request deletion of your account and associated data at any time by emailing
          us at <strong>maajithanas@gmail.com</strong>. We retain your data only for as long
          as necessary to provide accountability services.
        </p>

        <p className="text-gray-700 mt-8">
          By using Hey Jarvis, you consent to this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
