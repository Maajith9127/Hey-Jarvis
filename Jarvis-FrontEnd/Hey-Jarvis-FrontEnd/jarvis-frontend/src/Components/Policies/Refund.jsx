import React from "react";

const Refund = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Refund & Cancellation Policy</h1>

        <p className="text-gray-700 mb-4">
          This Refund & Cancellation Policy applies to all payments made on Hey Jarvis. By
          using our platform and making a payment, you agree to the terms outlined below.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Non-Refundable Payments</h2>
        <p className="text-gray-700 mb-4">
          Since Hey Jarvis operates on accountability penalties, all payments made towards
          penalties are <strong>non-refundable</strong>. This ensures commitment and fairness
          in our accountability system.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Exceptions</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
          <li>Duplicate transactions.</li>
          <li>Technical errors resulting in incorrect charges.</li>
          <li>Failed transactions where the amount was debited but not processed.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Refund Process</h2>
        <p className="text-gray-700 mb-4">
          If you believe you qualify for a refund, please contact us at
          <strong> maajithanas@gmail.com</strong> with your transaction details.
          Approved refunds will be processed within 7–10 business days.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Cancellation of Services</h2>
        <p className="text-gray-700 mb-4">
          Users may stop using Hey Jarvis services at any time. However, no refunds will be
          issued for penalties already deducted.
        </p>

        <p className="text-gray-700 mt-8">
          By continuing to use Hey Jarvis and making payments, you acknowledge and agree to
          this Refund & Cancellation Policy.
        </p>
      </div>
    </div>
  );
};

export default Refund;
