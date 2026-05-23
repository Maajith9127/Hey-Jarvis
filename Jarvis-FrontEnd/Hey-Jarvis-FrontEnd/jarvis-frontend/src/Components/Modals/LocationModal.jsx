import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import countries from '../../data/countries';

const LocationModal = ({ isOpen, onClose }) => {
    const [location, setLocation] = useState("");

    const handleSave = async () => {
        try {
            const res = await axiosInstance.patch("/api/user/location", { location });
            alert("📍 Location saved: " + res.data.location);
            onClose();
        } catch (err) {
            console.error(" Failed to update location", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-bold mb-4">Set Your Location</h2>

                <select
                    className="w-full border p-2 rounded mb-4 h-[40px] overflow-y-scroll"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">🌍 Select your country</option>
                    {countries.map((country, idx) => (
                        <option key={idx} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={!location}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
