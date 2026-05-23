import React from "react";

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Terms & Conditions</h1>
                <p className="text-gray-700 mb-4">
                    Welcome to Hey Jarvis. These Terms & Conditions outline the rules and regulations
                    for the use of our accountability and productivity platform. By accessing this
                    platform, we assume you accept these terms. Do not continue to use Hey Jarvis if
                    you do not agree to all the terms and conditions stated here.
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Services</h2>
                <p className="text-gray-700 mb-4">
                    Hey Jarvis provides productivity and accountability tools, including task scheduling,
                    live photo/video verification, randomised checks, and penalty-linked payment systems.
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. User Responsibilities</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                    <li>Users must provide accurate information during registration.</li>
                    <li>Users must comply with their local laws while using Hey Jarvis.</li>
                    <li>Accountability penalties are binding once agreed and cannot be disputed.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Prohibited Use</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
                    <li>Bypassing or attempting to bypass verification systems.</li>
                    <li>Uploading fake or fraudulent photos/videos.</li>
                    <li>Using Hey Jarvis for unlawful or harmful purposes.</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Payments & Penalties</h2>
                <p className="text-gray-700 mb-4">
                    All accountability penalties deducted through Hey Jarvis are final and non-refundable
                    as per our Refund Policy.
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Disclaimers</h2>
                <p className="text-gray-700 mb-4">
                    Hey Jarvis provides its services on a best-effort basis. We are not responsible for
                    any downtime or service issues caused by third-party providers such as Cashfree,
                    banks, or network operators.
                </p>

                <p className="text-gray-700 mt-8">
                    By continuing to use Hey Jarvis, you acknowledge and agree to these Terms & Conditions.
                </p>
            </div>
        </div>
    );
};

export default Terms;
