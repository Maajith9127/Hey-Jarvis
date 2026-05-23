import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEventsToRedux } from '../../ReduxToolkit/Slices/CalendarSlice';
import { generateRepeatedEvents } from '../../services/repeatService';

const RepeatModal = ({ isOpen, onClose }) => {
    const calendarEvents = useSelector(state => state.calendar.CalendarEvents);
    const photos = useSelector(state => state.photo.Photos);
    const messages = useSelector(state => state.message.messages);
    const dispatch = useDispatch();

    const [selectedTodos, setSelectedTodos] = useState([]);
    const [selectedAccountabilities, setSelectedAccountabilities] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);

    const [additionalInfo] = useState(`

 Important Notes for Gemini:

1️ You will be given two arrays from the frontend: 
   -  "selectedTodos" (contains Todo entries from Live Photos)
   -  "selectedAccountabilities" (contains Accountability entries from Messages)

2️ Your job is to generate a **series of Calendar Events** using the natural language prompt.

3️ Every Calendar Event should follow one of these two formats:

 Todo Event Format:
{
  Type: 'Todo',
  SpecificEventId: 'uuid',
  title: 'Task Name',
  start: 'ISO8601 format',
  end: 'ISO8601 format',
  timeSlot: 'Readable format',
  CollectionType: 'PhotoCollection',
  fromDb: false,
  TodoId: 'From selectedTodos',
  verified: false
}

 Accountability Event Format:
{
  Type: 'Accountability',
  SpecificEventId: 'uuid',
  title: 'Message',
  start: 'ISO8601 format',
  end: 'ISO8601 format',
  timeSlot: 'Readable format',
  CollectionType: 'MessageCollection',
  fromDb: false,
  AccountabilityId: 'From selectedAccountabilities',
  verified: false
}

Summary:
- TodoId must come from the selected photo.
- AccountabilityId must come from the selected message.
- Events can be constructed to overlap for validation logic to work.
`);

    if (!isOpen) return null;

    const toggleTodo = (photo) => {
        setSelectedTodos(prev =>
            prev.some(p => p.id === photo.id)
                ? prev.filter(p => p.id !== photo.id)
                : [...prev, photo]
        );
    };

    const toggleAccountability = (msg) => {
        setSelectedAccountabilities(prev =>
            prev.some(m => m._id === msg._id)
                ? prev.filter(m => m._id !== msg._id)
                : [...prev, msg]
        );
    };

    const isTodoSelected = (photo) => selectedTodos.some(p => p.id === photo.id);
    const isAccountabilitySelected = (msg) => selectedAccountabilities.some(m => m._id === msg._id);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert("Prompt cannot be empty.");
            return;
        }

        if (selectedTodos.length === 0 && selectedAccountabilities.length === 0) {
            alert("Please select at least one Todo or Accountability item.");
            return;
        }

        try {
            setLoading(true);
            const response = await generateRepeatedEvents({
                selectedTodos,
                selectedAccountabilities,
                prompt,
                additionalInfo
            });

            alert(" Events generated successfully!");
            response.events.forEach(event => dispatch(addEventsToRedux(event)));

        } catch (err) {
            console.error("Error generating events:", err);
            alert("Failed to generate events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Repeat Events</h2>
                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">To dos</h3>
                        <div className="flex flex-col h-[50%] overflow-x-scroll gap-2">
                            {photos.map(photo => (
                                <button
                                    key={photo.id}
                                    onClick={() => toggleTodo(photo)}
                                    className={`px-4 py-2 rounded text-left transition ${isTodoSelected(photo)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-blue-100 hover:bg-blue-200'
                                        }`}
                                >
                                    {photo.photoName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Accountabilities</h3>
                        <div className="flex flex-col h-[50%] overflow-x-scroll gap-2">
                            {messages.map(msg => (
                                <button
                                    key={msg._id}
                                    onClick={() => toggleAccountability(msg)}
                                    className={`px-4 py-2 rounded text-left transition ${isAccountabilitySelected(msg)
                                        ? 'bg-red-500 text-white'
                                        : 'bg-green-100 hover:bg-green-200'
                                        }`}
                                >
                                    {msg.message}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block font-medium text-gray-700 mb-1">Repeat Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="E.g. Repeat wake-up task at 5AM every weekday for 3 weeks"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Generating..." : "Generate Events"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepeatModal;
