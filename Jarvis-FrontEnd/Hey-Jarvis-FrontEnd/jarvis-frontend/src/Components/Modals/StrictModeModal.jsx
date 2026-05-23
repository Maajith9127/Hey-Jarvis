
import React, { useState } from 'react';
import { activateStrictMode } from '../../services/strictModeService'; // ✅ axios-based call

// --- Helper Component for Time Picker ---
const CustomTimePicker = ({ hour, minute, period, setHour, setMinute, setPeriod }) => {
    const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="flex items-center gap-2">
            <select value={hour} onChange={(e) => setHour(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="font-bold">:</span>
            <select value={minute} onChange={(e) => setMinute(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
};

// --- Handler Logic with Service Function ---
const handleApplyClick = async (endDate, hour, minute, period, onApply, onClose) => {
    if (!endDate) {
        alert("Please select a date.");
        return;
    }

    let hourIn24 = parseInt(hour, 10);
    if (period === 'PM' && hourIn24 < 12) hourIn24 += 12;
    if (period === 'AM' && hourIn24 === 12) hourIn24 = 0;

    const endTime = `${String(hourIn24).padStart(2, '0')}:${minute}`;
    const fullDateString = `${endDate}T${endTime}`;
    const finalDate = new Date(fullDateString);
    const timestamp = finalDate.getTime();

    try {
        const result = await activateStrictMode(timestamp); // ✅ uses axios
        console.log(" Strict Mode successfully set:", result);
        alert("Strict Mode has been activated!");

        onApply?.(timestamp);
        onClose?.();
    } catch (error) {
        console.error("❌ Failed to set Strict Mode:", error);
        alert("Something went wrong. Please try again.");
    }
};

// --- Main Modal Component ---
const StrictModeModal = ({ isOpen, onClose, onApply }) => {
    const [endDate, setEndDate] = useState('');
    const [hour, setHour] = useState('05');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('PM');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Set Strict Mode</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Until When?</label>
                        <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Till What Time?</label>
                        <CustomTimePicker
                            hour={hour}
                            minute={minute}
                            period={period}
                            setHour={setHour}
                            setMinute={setMinute}
                            setPeriod={setPeriod}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={() => handleApplyClick(endDate, hour, minute, period, onApply, onClose)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StrictModeModal;
