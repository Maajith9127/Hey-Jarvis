
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import {
  addMessageToRedux,
  updateMessageFromRedux,
  updateToAddressFromRedux,
  deleteMessageFromRedux,
  clearMessageDeltas,
  RebuildAddedFromMessages,
} from '../../../ReduxToolkit/Slices/MessageSlice.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchMessagesFromServer,
  saveMessagesToServer,
} from '.././../../services/messageService.js';

const Message = () => {
  const dispatch = useDispatch();
  const Messages = useSelector((state) => state.message.messages);
  const [isSavingMessages, setIsSavingMessages] = useState(false);
  const { added, updated, deleted } = useSelector((state) => state.message);

  //  Load messages from backend and populate redux
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const DbMessages = await fetchMessagesFromServer();

        console.log('📥 Fetched messages:', DbMessages);

        dispatch(clearMessageDeltas());
        DbMessages.forEach((msg) => {
          dispatch(addMessageToRedux({ ...msg, fromDb: true }));
        });

        dispatch(RebuildAddedFromMessages());
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
      }
    };

    loadMessages();
  }, []);

  //  Save delta to backend
  const SaveMessages = async () => {
    if (isSavingMessages) return;
    setIsSavingMessages(true);

    try {
      const payload = { added, updated, deleted };
      console.log('📤 Payload to save:', payload);

      const res = await saveMessagesToServer(payload);
      console.log('✅ Server response:', res);

      toast.success(res?.data?.message || "✅ Messages saved successfully!");
      dispatch(clearMessageDeltas());
    } catch (error) {
      console.error('❌ Error saving messages:', error);

      const errorMsg = error?.response?.data?.error || error?.message || "Something went wrong while saving.";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsSavingMessages(false);
    }
  };



  //  Message actions
  const AddMessageToRedux = () => {
    const newMessage = {
      AccountabilityId: uuidv4(),
      message: 'Message',
      ToAddress: 'Email',
      CollectionType: 'MessageCollection',
    };
    dispatch(addMessageToRedux(newMessage));
  };

  const UpdateMessageFromRedux = (e) => {
    const payload = {
      AccountabilityIdToUpdate: e.target.getAttribute('data-id'),
      newValue: e.target.value,
    };
    dispatch(updateMessageFromRedux(payload));
  };

  const UpdateToAddressFromRedux = (e) => {
    const payload = {
      AccountabilityIdToUpdate: e.target.getAttribute('data-id'),
      newValue: e.target.value,
    };
    dispatch(updateToAddressFromRedux(payload));
  };

  const DeleteMessageFromRedux = (e) => {
    const payload = {
      AccountabilityIdToDelete: e.target.getAttribute('data-id'),
    };
    dispatch(deleteMessageFromRedux(payload));
  };

  return (
    <div className="p-4 md:p-7 max-w-7xl mx-auto">
      {/* Header buttons */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mb-6">
        <button
          onClick={AddMessageToRedux}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition"
        >
          Add Message
        </button>

        <button
          onClick={SaveMessages}
          disabled={isSavingMessages}
          className={`w-full sm:w-auto px-6 py-3 font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2 ${isSavingMessages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
        >
          {isSavingMessages && (
            <svg
              className="animate-spin h-4 w-4 text-white"
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
          {isSavingMessages ? "Saving..." : "💾 Save"}
        </button>
      </div>

      {/* Message List */}
      <div className="rounded-3xl overflow-y-auto h-[75vh] bg-white/60 backdrop-blur-lg shadow-lg p-4 space-y-6 border border-slate-200">
        {Messages.map((e) => (
          <div
            key={e.AccountabilityId}
            className="flex flex-col md:flex-row gap-4 md:items-center border border-slate-300 rounded-2xl shadow-sm bg-white p-4"
          >
            <input
              data-id={e.AccountabilityId}
              onChange={UpdateMessageFromRedux}
              value={e.message}
              type="text"
              placeholder="📨 Message content..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            />
            <input
              data-id={e.AccountabilityId}
              onChange={UpdateToAddressFromRedux}
              value={e.ToAddress}
              type="text"
              placeholder="✉️ To (Email, SMS, WhatsApp)"
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            />
            <button
              data-id={e.AccountabilityId}
              onClick={DeleteMessageFromRedux}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition w-full md:w-auto"
            >
              🗑️
            </button>
          </div>

        ))}
        <ToastContainer position="top-center" theme="colored" autoClose={3000} />

      </div>
    </div>
  );  
};

export default Message;
