

import React from 'react';
//  Camera Icon Component
export const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7h4l2-3h6l2 3h4a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 11a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
);

// Header Section with Save button spinner
const HeaderSection = ({ onAddPhoto, onSavePhoto, isSavingPhoto }) => {
    return (
        <div className='px-5 py-7 border bg-white border-slate-200 flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Verification</h1>

            <div className=' flex gap-1'>

                {/* Add Photo */}
                <button
                    onClick={onAddPhoto}
                    type='button'
                    className='flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-1 rounded-md hover:bg-blue-700 transition'
                >
                    Add Photo
                </button>

                {/* Save Button */}
                <button
                    onClick={onSavePhoto}
                    type='button'
                    disabled={isSavingPhoto}
                    className={`flex items-center justify-center gap-2 px-4 py-1 rounded-md font-semibold text-sm transition ${isSavingPhoto
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                >
                    {isSavingPhoto && (
                        <svg
                            className="animate-spin h-4 w-4 text-white text-sm"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                    )}
                    {isSavingPhoto ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default HeaderSection;
