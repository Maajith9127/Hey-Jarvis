import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Target, Hash, Clock, Users, Send, CheckCircle, DollarSign, MessageSquare } from 'lucide-react';
import {
    createRandomisedSetting,
} from "../../../services/randomisedService";
import { toast } from "react-toastify";
import useRandomisedSettings from '../../../hooks/useRandomisedSettings';
import { useEffect } from 'react';

const Randomised = () => {
    const messages = useSelector((state) => state.message.messages);
    const payouts = useSelector((state) => state.payout.Payouts);
    const { data, isLoading, error } = useRandomisedSettings()

    useEffect(() => {
        console.log(data)
        if (data) {
            setSelectedItem({
                AccountabilityId: data.AccountabilityId,
                label: data.label || "Loaded from DB",
                type: data.CollectionType || "MessageCollection",
            });
            setNumEvents(data.numberOfEvents);
            setSlotDuration(data.slotDuration);
            setMaxAccountabilities(data.maxAccountabilities);
        }
    }, [data]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [numEvents, setNumEvents] = useState(1);
    const [slotDuration, setSlotDuration] = useState(10);
    const [maxAccountabilities, setMaxAccountabilities] = useState(1);
    // Combine messages and payouts into one array
    const allAccountabilities = [
        ...messages.map((msg) => ({
            AccountabilityId: msg.AccountabilityId,
            label: msg.message,
            type: 'MessageCollection',
        })),
        ...payouts.map((payout) => ({
            AccountabilityId: payout.AccountabilityId,
            label: `${payout.name} - ₹${payout.amount}`,
            type: 'PayoutCollection',
        })),
    ];

    const handleSubmit = async () => {
        if (!selectedItem) {
            alert("Please select an accountability item.");
            return;
        }

        const payload = {
            ...selectedItem,
            numberOfEvents: numEvents,
            slotDuration: slotDuration,
            maxAccountabilities: maxAccountabilities,
        };

        try {
            // 1. Delete existing settings for this AccountabilityId
            // await deleteRandomisedSetting(selectedItem.AccountabilityId);
            // 2. Create new setting
            const res = await createRandomisedSetting(payload);
            toast.success(" Settings saved successfully!");
            console.log(" New Randomised Setting:", res);
        } catch (err) {
            console.error(" Failed to save randomised setting:", err);
            toast.error("Failed to save settings.");
        }
    };
    const isSelected = (item) => selectedItem?.AccountabilityId === item.AccountabilityId;
    const isMessage = (item) => item.type === 'MessageCollection';
    return (
        <div className="max-w-4xl mx-auto p-6 border-slate-200 shadow-md rounded-b-xl ">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Randomised Event Settings</h1>
                </div>
                <p className="text-gray-600">Configure your accountability events and scheduling preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Select Accountability */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Select Accountability
                        </h3>

                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {allAccountabilities.map((item) => (
                                <div
                                    key={item.AccountabilityId}
                                    onClick={() => setSelectedItem(item)}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${isSelected(item)
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {isMessage(item) ? (
                                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                            ) : (
                                                <DollarSign className="w-5 h-5 text-green-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 mb-1">{item.label}</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isMessage(item)
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {isMessage(item) ? 'Message' : 'Payout'}
                                            </span>
                                        </div>
                                        {isSelected(item) && (
                                            <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Settings */}
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Configuration</h3>

                        <div className="space-y-6">
                            {/* Number of Events */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Hash className="w-4 h-4" />
                                    Number of Events
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={numEvents}
                                    onChange={(e) => setNumEvents(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter number of events"
                                />
                            </div>

                            {/* Slot Duration */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Clock className="w-4 h-4" />
                                    Slot Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={slotDuration}
                                    onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter duration in minutes"
                                />
                            </div>

                            {/* Max Accountabilities */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Users className="w-4 h-4" />
                                    Max Accountabilities
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={maxAccountabilities}
                                    onChange={(e) => setMaxAccountabilities(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter max accountabilities"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <Send className="w-5 h-5" />
                            Submit Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Selected Item */}
            {selectedItem && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-medium text-blue-900 mb-2">Selected Accountability:</h4>
                    <div className="flex items-center gap-2">
                        {isMessage(selectedItem) ? (
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                            <DollarSign className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-blue-800">{selectedItem.label}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Randomised;