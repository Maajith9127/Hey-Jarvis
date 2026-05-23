
// import React, { useState, useEffect } from 'react';
// import { store } from '../../ReduxToolkit/store';
// import StrictModeModal from '../Modals/StrictModeModal';
// import RepeatModal from '../Modals/RepeatModal';
// import SignInModal from '../Modals/SignInModal';
// import PenaltyModal from '../Modals/PenaltyModal.jsx';
// import { saveAllCalendarData } from '../../services/calendarService.js';
// import { activateStrictMode } from '../../services/strictModeService';
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleDeleteMode,toggleStrictModeAll } from '../../ReduxToolkit/Slices/CalendarSlice.jsx';
// import {
//   setCopyMode,
//   setPasteMode,
//   clearCopyPaste,
// } from '../../ReduxToolkit/Slices/CopyPasteSlice';




// const CalendarControls = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showRepeatModal, setShowRepeatModal] = useState(false);
//   const [nextScheduleTime, setNextScheduleTime] = useState(null);
//   const [showSignInModal, setShowSignInModal] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lockedUntil, setLockedUntil] = useState(null);
//   const [showPenaltyModal, setShowPenaltyModal] = useState(false);
//   const { mode, copiedEvents } = useSelector((state) => state.copyPaste);

//   console.log(mode)

//   useEffect(() => {
//     const updateFromLocal = () => {
//       const value = localStorage.getItem("selectedStrictMode");
//       if (value && value !== "No Strict Mode Selected") {
//         setLockedUntil(new Date(value));
//       } else {
//         setLockedUntil(null);
//       }
//     };

//     updateFromLocal(); // initial load

//     window.addEventListener("strictModeUpdated", updateFromLocal);

//     return () => {
//       window.removeEventListener("strictModeUpdated", updateFromLocal);
//     };
//   }, []);

//   useEffect(() => {
//     const updateNextSchedule = () => {
//       const savedTime = localStorage.getItem("nextScheduleTime");
//       if (savedTime) {
//         setNextScheduleTime(new Date(savedTime));
//       } else {
//         setNextScheduleTime(null);
//       }
//     };

//     updateNextSchedule();

//     window.addEventListener("storage", updateNextSchedule);             // 🔁 for multi-tab
//     window.addEventListener("nextScheduleUpdated", updateNextSchedule); // ✅ for same tab WS updates

//     return () => {
//       window.removeEventListener("storage", updateNextSchedule);
//       window.removeEventListener("nextScheduleUpdated", updateNextSchedule);
//     };
//   }, []);

//   const dispatch = useDispatch();
//   const deleteMode = useSelector((state) => state.calendar.deleteMode); //  Redux value
//   const strictModeAll = useSelector((state) => state.calendar.strictModeAll);

//   let pressTimer;

//   const useLongPress = (onLongPress, onClick, { delay = 800 } = {}) => {
//   const timerRef = React.useRef(null);
//   const isLongPress = React.useRef(false);

//   const start = (event) => {
//     isLongPress.current = false;
//     timerRef.current = setTimeout(() => {
//       onLongPress(event);
//       isLongPress.current = true;
//     }, delay);
//   };

//   const clear = (event, shouldTriggerClick = true) => {
//     clearTimeout(timerRef.current);
//     if (shouldTriggerClick && !isLongPress.current) {
//       onClick(event);
//     }
//   };

//   return {
//     onMouseDown: start,
//     onTouchStart: start,
//     onMouseUp: (e) => clear(e, true),
//     onMouseLeave: (e) => clear(e, false),
//     onTouchEnd: (e) => clear(e, true),
//   };
// };


//   const HandleSubmit = async () => {
//     if (isSaving) return;
//     setIsSaving(true);

//     const state = store.getState();
//     const payload = {
//       Photos: state.photo,
//       CalendarEvents: state.calendar,
//       AccountabilityMessages: state.message,
//       Payouts: {
//         added: state.payout.added,
//         updated: state.payout.updated,
//         deleted: state.payout.deleted
//       }
//     };

//     try {
//       const result = await saveAllCalendarData(payload);
//       console.log(" Synced:", result);
//       const nextScheduleTime = new Date(result.nextScheduledAt)
//       localStorage.setItem("nextScheduleTime", nextScheduleTime.toISOString()); // ✅ Store as string
//       setNextScheduleTime(nextScheduleTime);
//       toast.success(" All changes saved successfully!");
//       window.location.reload(); //  Reload on save
//     } catch (err) {
//       console.error(" Sync failed:", err);

//       if (err.response?.status === 403 && err.response?.data?.error?.includes("Strict Mode")) {
//         const blockedItems = err.response?.data?.blocked || [];
//         const itemTypes = [...new Set(blockedItems.map(item => item.type))].join(", ");
//         toast.error(` Strict Mode active! Blocked changes in: ${itemTypes}`);
//       } else {

//         window.location.reload();
//         // toast.error(err.response?.data?.error || "Unknown error occurred");
//       }
//     } finally {
//       // toast.success(" All changes saved successfully!");
//       setIsSaving(false);
//     }
//   };
//   const openStrictModeModal = () => {
//     setIsModalOpen(true);
//     console.log("Strict Mode Clicked, opening modal.");
//   };
//   const closeStrictModeModal = () => {
//     setIsModalOpen(false);
//   };
//   const HandleStrictMode = async () => {
//     try {
//       const timestamp = Date.now();
//       const res = await activateStrictMode(timestamp);
//       console.log(" Strict Mode Activated:", res);
//     } catch (err) {
//       console.error("Failed to activate strict mode:", err);
//     }
//   };
//   const handleCopyPasteToggle = () => {
//     if (mode === 'off') {
//       dispatch(setCopyMode());

//     } else if (mode === 'copy') {
//       dispatch(setPasteMode())

//     } else if (mode === 'paste') {
//       dispatch(clearCopyPaste())


//     }
//   };

//   return (
//     <div className="w-full mt-1 flex flex-wrap justify-center items-center gap-1 sticky top-0 z-50 bg-white">
//       <button
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//         onClick={() => setShowRepeatModal(true)}
//       >
//         Repeat
//       </button>

//       <button
//         onClick={openStrictModeModal}
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//       >
//         Strict Mode
//       </button>

//       <button
//         onClick={HandleSubmit}
//         disabled={isSaving}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${isSaving
//           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//           : "bg-white hover:bg-gray-100"
//           }`}
//       >
//         {isSaving ? "Saving..." : "Save"}
//       </button>

//       <button
//         onClick={() => setShowSignInModal(true)}
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//       >
//         SignIn
//       </button>

//       <button
//         onClick={handleCopyPasteToggle}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${mode === 'copy'
//           ? 'bg-yellow-100 text-yellow-800'
//           : mode === 'paste'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-white hover:bg-gray-100'
//           }`}
//       >
//         {mode === 'off' && 'Copy'}
//         {mode === 'copy' && `Copy (${copiedEvents.length})`}
//         {mode === 'paste' && 'Paste'}
//       </button>
//       {/*  Delete Mode Toggle Button using Redux */}
//       <button
//         onClick={() => dispatch(toggleDeleteMode())}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap rounded-md ${deleteMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-700 text-white hover:bg-gray-800'
//           }`}
//       >
//         {deleteMode ? "Delete" : "Delete"}
//       </button>

//       <button
//         onClick={() => setShowPenaltyModal(true)}
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//       >
//         Penalty
//       </button>

//       <PenaltyModal
//         isOpen={showPenaltyModal}
//         onClose={() => setShowPenaltyModal(false)}
//       />

//       <div className='flex gap-1 justify-center items-center'>
//         {nextScheduleTime ? (
//           <div className="mt-2 w-full  flex justify-center">
//             <div className="flex items-center gap-2 bg-blue-50  border-blue-300 text-blue-700 text-sm rounded-lg px-4 py-2 shadow-sm">
//               <span>
//                 Next verification at:{" "}
//                 <span className="font-semibold">
//                   {nextScheduleTime.toLocaleString("en-IN", {
//                     timeZone: "Asia/Kolkata",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                     day: "numeric",
//                     month: "short",
//                     weekday: "short",
//                   })}
//                 </span>
//               </span>
//             </div>
//           </div>
//         ) : (

//           <div className="mt-2  w-[70%] justify-center   bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm  rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
//             No upcoming accountability scheduled
//           </div>
//         )}

//         {lockedUntil && new Date(lockedUntil) > new Date() ? (
//           <div className="mt-1 px-2 py-1 bg-gray-100 border rounded text-sm text-gray-700 shadow-sm">
//             Locked until:{" "}
//             <span className="font-medium">
//               {lockedUntil.toLocaleTimeString("en-IN", {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//               })},{" "}
//               {lockedUntil.toLocaleDateString("en-IN", {
//                 weekday: 'short',
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric',
//               })}
//             </span>
//           </div>
//         ) : (
//           <div className="mt-1 px-2 py-1 bg-green-50 border-green-300 rounded text-sm text-green-800 shadow-sm">
//             Free to Edit — No Strict Mode Active
//           </div>
//         )}


//       </div>

//       <StrictModeModal isOpen={isModalOpen} onClose={closeStrictModeModal} />
//       <RepeatModal isOpen={showRepeatModal} onClose={() => setShowRepeatModal(false)} />
//       <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
//     </div>
//   );
// };

// export default CalendarControls;





import React, { useState, useEffect, useRef } from 'react';
import { store } from '../../ReduxToolkit/store';
import StrictModeModal from '../Modals/StrictModeModal';
import RepeatModal from '../Modals/RepeatModal';
import SignInModal from '../Modals/SignInModal';
import PenaltyModal from '../Modals/PenaltyModal.jsx';
import { saveAllCalendarData } from '../../services/calendarService.js';
import { activateStrictMode } from '../../services/strictModeService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDeleteMode, toggleStrictModeAll } from '../../ReduxToolkit/Slices/CalendarSlice.jsx';
import {
  setCopyMode,
  setPasteMode,
  clearCopyPaste,
} from '../../ReduxToolkit/Slices/CopyPasteSlice';


// ✅ reusable long press hook
const useLongPress = (onLongPress, onClick, { delay = 800 } = {}) => {
  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const start = (event) => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      onLongPress(event);
      isLongPress.current = true;
    }, delay);
  };

  const clear = (event, shouldTriggerClick = true) => {
    clearTimeout(timerRef.current);
    if (shouldTriggerClick && !isLongPress.current) {
      onClick(event);
    }
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: (e) => clear(e, true),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e, true),
  };
};

const CalendarControls = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [nextScheduleTime, setNextScheduleTime] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);

  const { mode, copiedEvents } = useSelector((state) => state.copyPaste);
  const deleteMode = useSelector((state) => state.calendar.deleteMode);
  const strictModeAll = useSelector((state) => state.calendar.strictModeAll);

  const dispatch = useDispatch();

  // 🔁 strict mode date updates
  useEffect(() => {
    const updateFromLocal = () => {
      const value = localStorage.getItem("selectedStrictMode");
      if (value && value !== "No Strict Mode Selected") {
        setLockedUntil(new Date(value));
      } else {
        setLockedUntil(null);
      }
    };

    updateFromLocal();
    window.addEventListener("strictModeUpdated", updateFromLocal);

    return () => {
      window.removeEventListener("strictModeUpdated", updateFromLocal);
    };
  }, []);

  // 🔁 next schedule updates
  useEffect(() => {
    const updateNextSchedule = () => {
      const savedTime = localStorage.getItem("nextScheduleTime");
      if (savedTime) {
        setNextScheduleTime(new Date(savedTime));
      } else {
        setNextScheduleTime(null);
      }
    };

    updateNextSchedule();
    window.addEventListener("storage", updateNextSchedule);
    window.addEventListener("nextScheduleUpdated", updateNextSchedule);

    return () => {
      window.removeEventListener("storage", updateNextSchedule);
      window.removeEventListener("nextScheduleUpdated", updateNextSchedule);
    };
  }, []);

  // ✅ long press Strict Mode handlers
  const longPressProps = useLongPress(
    () => dispatch(toggleStrictModeAll()), // long press → toggle strictModeAll
    () => setIsModalOpen(true),            // short click → open modal
    { delay: 800 }
  );

  // const HandleSubmit = async () => {
  //   if (isSaving) return;
  //   setIsSaving(true);

  //   const state = store.getState();
  //   const payload = {
  //     Photos: state.photo,
  //     CalendarEvents: state.calendar,
  //     AccountabilityMessages: state.message,
  //     Payouts: {
  //       added: state.payout.added,
  //       updated: state.payout.updated,
  //       deleted: state.payout.deleted
  //     }
  //   };

  //   try {
  //     const result = await saveAllCalendarData(payload);
  //     console.log(" Synced:", result);
  //     const nextScheduleTime = new Date(result.nextScheduledAt);
  //     localStorage.setItem("nextScheduleTime", nextScheduleTime.toISOString());
  //     setNextScheduleTime(nextScheduleTime);
  //     toast.success(" All changes saved successfully!");
  //     window.location.reload();
  //   } catch (err) {
  //     console.error(" Sync failed:", err);
  //     if (err.response?.status === 403 && err.response?.data?.error?.includes("Strict Mode")) {
  //       const blockedItems = err.response?.data?.blocked || [];
  //       const itemTypes = [...new Set(blockedItems.map(item => item.type))].join(", ");
  //       toast.error(` Strict Mode active! Blocked changes in: ${itemTypes}`);
  //     } else {
  //       window.location.reload();
  //     }
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };


  const HandleSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const state = store.getState();

    const payload = {
      Photos: state.photo,
      CalendarEvents: state.calendar,
      AccountabilityMessages: state.message,
      Payouts: {
        added: state.payout.added,
        updated: state.payout.updated,
        deleted: state.payout.deleted
      }
    };

    try {
      // ✅ Step 1: Save all data
      const result = await saveAllCalendarData(payload);
      console.log("✅ Synced:", result);

      // ✅ Step 2: Update next schedule
      const nextScheduleTime = new Date(result.nextScheduledAt);
      if (!isNaN(nextScheduleTime)) {
        localStorage.setItem("nextScheduleTime", nextScheduleTime.toISOString());
        setNextScheduleTime(nextScheduleTime);
      }

      toast.success(" All changes saved successfully!");

      // ✅ Step 3: Strict Mode logic
      if (state.calendar.strictModeAll && state.calendar.CalendarEvents.length > 0) {
        const now = Date.now();

        console.log("📌 Full CalendarEvents:", state.calendar.CalendarEvents);

        const futureEnds = state.calendar.CalendarEvents
          .map(ev => {
            console.log("➡️ Checking event:", ev.title, "end:", ev.end);

            if (!ev.end) {
              console.warn("⚠️ Event has no end:", ev);
              return NaN;
            }

            const parsed = new Date(ev.end).getTime();
            console.log("   Parsed end:", parsed, "| Valid:", !isNaN(parsed));

            return parsed;
          })
          .filter(time => !isNaN(time) && time > now)
          .sort((a, b) => a - b);

        console.log("✅ Filtered futureEnds:", futureEnds);

        if (futureEnds.length > 0) {
          const nearestEnd = futureEnds[0];
          console.log("🚀 Nearest upcoming end:", nearestEnd, "| ISO:", new Date(nearestEnd).toISOString());

          try {
            await activateStrictMode(nearestEnd); // backend call
            console.log(" Strict Mode activated till:", new Date(nearestEnd).toISOString());
          } catch (err) {
            console.error("❌ Failed to activate strict mode:", err);
            toast.error("Failed to activate strict mode");
          }
        } else {
          console.warn("⚠️ No upcoming valid calendar events found for strict mode.");
        }
      }

      // ✅ Step 4: Reload after debug phase
      window.location.reload();

    } catch (err) {
      console.error("❌ Sync failed:", err);

      if (err.response?.status === 403 && err.response?.data?.error?.includes("Strict Mode")) {
        const blockedItems = err.response?.data?.blocked || [];
        const itemTypes = [...new Set(blockedItems.map(item => item.type))].join(", ");
        toast.error(` Strict Mode active! Blocked changes in: ${itemTypes}`);
      } else {
        console.log("Unexpected error:", err);
        window.location.reload();
      }
    } finally {
      setIsSaving(false);
    }
  };






  const handleCopyPasteToggle = () => {
    if (mode === 'off') {
      dispatch(setCopyMode());
    } else if (mode === 'copy') {
      dispatch(setPasteMode());
    } else if (mode === 'paste') {
      dispatch(clearCopyPaste());
    }
  };

  return (
    <div className="w-full mt-1 flex flex-wrap justify-center items-center gap-1 sticky top-0 z-50 bg-white">
      {/* Repeat */}
      <button
        className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
        onClick={() => setShowRepeatModal(true)}
      >
        Repeat
      </button>

      {/* Strict Mode (short click = modal, long press = global strict) */}
      <button
        {...longPressProps}
        className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${strictModeAll
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-white hover:bg-gray-100"
          }`}
      >
        Strict Mode
      </button>

      {/* Save */}
      <button
        onClick={HandleSubmit}
        disabled={isSaving}
        className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${isSaving
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-white hover:bg-gray-100"
          }`}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

      {/* SignIn */}
      <button
        onClick={() => setShowSignInModal(true)}
        className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
      >
        SignIn
      </button>

      {/* Copy / Paste */}
      <button
        onClick={handleCopyPasteToggle}
        className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${mode === 'copy'
          ? 'bg-yellow-100 text-yellow-800'
          : mode === 'paste'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-white hover:bg-gray-100'
          }`}
      >
        {mode === 'off' && 'Copy'}
        {mode === 'copy' && `Copy (${copiedEvents.length})`}
        {mode === 'paste' && 'Paste'}
      </button>

      {/* Delete Mode */}
      <button
        onClick={() => dispatch(toggleDeleteMode())}
        className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap rounded-md ${deleteMode
          ? 'bg-red-600 text-white hover:bg-red-700'
          : 'bg-gray-700 text-white hover:bg-gray-800'
          }`}
      >
        Delete
      </button>

      {/* Penalty */}
      <button
        onClick={() => setShowPenaltyModal(true)}
        className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
      >
        Penalty
      </button>

      <PenaltyModal
        isOpen={showPenaltyModal}
        onClose={() => setShowPenaltyModal(false)}
      />

      {/* Info Bars */}
      <div className='flex gap-1 justify-center items-center'>
        {nextScheduleTime ? (
          <div className="mt-2 w-full flex justify-center">
            <div className="flex items-center gap-2 bg-blue-50 border-blue-300 text-blue-700 text-sm rounded-lg px-4 py-2 shadow-sm">
              <span>
                Next verification at:{" "}
                <span className="font-semibold">
                  {nextScheduleTime.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "short",
                    weekday: "short",
                  })}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-2 w-[70%] justify-center bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
            No upcoming accountability scheduled
          </div>
        )}

        {lockedUntil && new Date(lockedUntil) > new Date() ? (
          <div className="mt-1 px-2 py-1 bg-gray-100 border rounded text-sm text-gray-700 shadow-sm">
            Locked until:{" "}
            <span className="font-medium">
              {lockedUntil.toLocaleTimeString("en-IN", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })},{" "}
              {lockedUntil.toLocaleDateString("en-IN", {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        ) : (
          <div className="mt-1 px-2 py-1 bg-green-50 border-green-300 rounded text-sm text-green-800 shadow-sm">
            Free to Edit — No Strict Mode Active
          </div>
        )}
      </div>

      {/* Modals */}
      <StrictModeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RepeatModal isOpen={showRepeatModal} onClose={() => setShowRepeatModal(false)} />
      <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
    </div>
  );
};

export default CalendarControls;



















































































// import React, { useState, useEffect, useRef } from 'react';
// import { store } from '../../ReduxToolkit/store';
// import StrictModeModal from '../Modals/StrictModeModal';
// import RepeatModal from '../Modals/RepeatModal';
// import SignInModal from '../Modals/SignInModal';
// import PenaltyModal from '../Modals/PenaltyModal.jsx';
// import { saveAllCalendarData } from '../../services/calendarService.js';
// import { activateStrictMode } from '../../services/strictModeService';
// import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleDeleteMode, toggleStrictModeAll } from '../../ReduxToolkit/Slices/CalendarSlice.jsx';
// import {
//   setCopyMode,
//   setPasteMode,
//   clearCopyPaste,
// } from '../../ReduxToolkit/Slices/CopyPasteSlice';


// // ✅ reusable long press hook
// const useLongPress = (onLongPress, onClick, { delay = 800 } = {}) => {
//   const timerRef = useRef(null);
//   const isLongPress = useRef(false);

//   const start = (event) => {
//     isLongPress.current = false;
//     timerRef.current = setTimeout(() => {
//       onLongPress(event);
//       isLongPress.current = true;
//     }, delay);
//   };

//   const clear = (event, shouldTriggerClick = true) => {
//     clearTimeout(timerRef.current);
//     if (shouldTriggerClick && !isLongPress.current) {
//       onClick(event);
//     }
//   };

//   return {
//     onMouseDown: start,
//     onTouchStart: start,
//     onMouseUp: (e) => clear(e, true),
//     onMouseLeave: (e) => clear(e, false),
//     onTouchEnd: (e) => clear(e, true),
//   };
// };


// const CalendarControls = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showRepeatModal, setShowRepeatModal] = useState(false);
//   const [nextScheduleTime, setNextScheduleTime] = useState(null);
//   const [showSignInModal, setShowSignInModal] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [lockedUntil, setLockedUntil] = useState(null);
//   const [showPenaltyModal, setShowPenaltyModal] = useState(false);

//   const { mode, copiedEvents } = useSelector((state) => state.copyPaste);
//   const deleteMode = useSelector((state) => state.calendar.deleteMode);
//   const strictModeAll = useSelector((state) => state.calendar.strictModeAll);

//   const dispatch = useDispatch();

//   // 🔁 strict mode date updates
//   useEffect(() => {
//     const updateFromLocal = () => {
//       const value = localStorage.getItem("selectedStrictMode");
//       if (value && value !== "No Strict Mode Selected") {
//         setLockedUntil(new Date(value));
//       } else {
//         setLockedUntil(null);
//       }
//     };

//     updateFromLocal();
//     window.addEventListener("strictModeUpdated", updateFromLocal);

//     return () => {
//       window.removeEventListener("strictModeUpdated", updateFromLocal);
//     };
//   }, []);

//   // 🔁 next schedule updates
//   useEffect(() => {
//     const updateNextSchedule = () => {
//       const savedTime = localStorage.getItem("nextScheduleTime");
//       if (savedTime) {
//         setNextScheduleTime(new Date(savedTime));
//       } else {
//         setNextScheduleTime(null);
//       }
//     };

//     updateNextSchedule();
//     window.addEventListener("storage", updateNextSchedule);
//     window.addEventListener("nextScheduleUpdated", updateNextSchedule);

//     return () => {
//       window.removeEventListener("storage", updateNextSchedule);
//       window.removeEventListener("nextScheduleUpdated", updateNextSchedule);
//     };
//   }, []);

//   // ✅ long press Strict Mode handlers
//   const longPressProps = useLongPress(
//     () => dispatch(toggleStrictModeAll()), // long press = toggle global strict mode
//     () => setIsModalOpen(true),            // short click = open modal
//     { delay: 800 }
//   );

//   // save all
//   // const HandleSubmit = async () => {
//   //   if (isSaving) return;
//   //   setIsSaving(true);

//   //   const state = store.getState();
//   //   const payload = {
//   //     Photos: state.photo,
//   //     CalendarEvents: state.calendar,
//   //     AccountabilityMessages: state.message,
//   //     Payouts: {
//   //       added: state.payout.added,
//   //       updated: state.payout.updated,
//   //       deleted: state.payout.deleted,
//   //     },
//   //   };

//   //   try {
//   //     const result = await saveAllCalendarData(payload);
//   //     console.log(" Synced:", result);

//   //     const nextScheduleTime = new Date(result.nextScheduledAt);
//   //     localStorage.setItem("nextScheduleTime", nextScheduleTime.toISOString());
//   //     setNextScheduleTime(nextScheduleTime);

//   //     toast.success(" All changes saved successfully!");
//   //     window.location.reload();
//   //   } catch (err) {
//   //     console.error(" Sync failed:", err);

//   //     if (err.response?.status === 403 && err.response?.data?.error?.includes("Strict Mode")) {
//   //       const blockedItems = err.response?.data?.blocked || [];
//   //       const itemTypes = [...new Set(blockedItems.map(item => item.type))].join(", ");
//   //       toast.error(` Strict Mode active! Blocked changes in: ${itemTypes}`);
//   //     } else {
//   //       window.location.reload();
//   //     }
//   //   } finally {
//   //     setIsSaving(false);
//   //   }
//   // };

//   const HandleSubmit = async () => {
//     if (isSaving) return;
//     setIsSaving(true);

//     const state = store.getState();

//     //  Make safe deep copies (so we don’t mutate Redux state directly)
//     const calendarCopy = JSON.parse(JSON.stringify(state.calendar));
//     const photoCopy = JSON.parse(JSON.stringify(state.photo));
//     const messageCopy = JSON.parse(JSON.stringify(state.message));
//     const payoutCopy = JSON.parse(JSON.stringify(state.payout));

//     //  Find latest calendar end
//     let maxEndTime = null;
//     if (calendarCopy.CalendarEvents.length > 0) {
//       maxEndTime = calendarCopy.CalendarEvents.reduce((latest, ev) => {
//         const end = new Date(ev.end).getTime();
//         return end > latest ? end : latest;
//       }, 0);
//     }

//     //  If strictModeAll, add strict locks
//     if (calendarCopy.strictModeAll) {
//       // Calendar → each locked to its own end
//       calendarCopy.CalendarEvents = calendarCopy.CalendarEvents.map(ev => ({
//         ...ev,
//         StrictMode: new Date(ev.end).toISOString(),
//       }));

//       // Others → locked to max end
//       if (maxEndTime) {
//         const strictUntil = new Date(maxEndTime).toISOString();

//         photoCopy.StrictMode = strictUntil;
//         messageCopy.StrictMode = strictUntil;
//         payoutCopy.StrictMode = strictUntil;
//       }
//     }

//     //Final payload
//     const payload = {
//       Photos: photoCopy,
//       CalendarEvents: calendarCopy,
//       AccountabilityMessages: messageCopy,
//       Payouts: {
//         added: payoutCopy.added,
//         updated: payoutCopy.updated,
//         deleted: payoutCopy.deleted,
//       },
//     };

//     try {
//       const result = await saveAllCalendarData(payload);
//       console.log(" Synced:", result);

//       const nextScheduleTime = new Date(result.nextScheduledAt);
//       localStorage.setItem("nextScheduleTime", nextScheduleTime.toISOString());
//       setNextScheduleTime(nextScheduleTime);

//       toast.success(" All changes saved successfully!");
//       window.location.reload();
//     } catch (err) {
//       console.error(" Sync failed:", err);

//       if (err.response?.status === 403 && err.response?.data?.error?.includes("Strict Mode")) {
//         const blockedItems = err.response?.data?.blocked || [];
//         const itemTypes = [...new Set(blockedItems.map(item => item.type))].join(", ");
//         toast.error(` Strict Mode active! Blocked changes in: ${itemTypes}`);
//       } else {
//         window.location.reload();
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };


//   // copy/paste toggle
//   const handleCopyPasteToggle = () => {
//     if (mode === 'off') {
//       dispatch(setCopyMode());
//     } else if (mode === 'copy') {
//       dispatch(setPasteMode());
//     } else if (mode === 'paste') {
//       dispatch(clearCopyPaste());
//     }
//   };

//   return (
//     <div className="w-full mt-1 flex flex-wrap justify-center items-center gap-1 sticky top-0 z-50 bg-white">
//       {/* Repeat */}
//       <button
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//         onClick={() => setShowRepeatModal(true)}
//       >
//         Repeat
//       </button>

//       {/* Strict Mode (short click = modal, long press = global strict) */}
//       <button
//         {...longPressProps}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${strictModeAll
//           ? "bg-red-600 text-white hover:bg-red-700"
//           : "bg-white hover:bg-gray-100"
//           }`}
//       >
//         Strict Mode
//       </button>

//       {/* Save */}
//       <button
//         onClick={HandleSubmit}
//         disabled={isSaving}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${isSaving
//           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//           : "bg-white hover:bg-gray-100"
//           }`}
//       >
//         {isSaving ? "Saving..." : "Save"}
//       </button>

//       {/* SignIn */}
//       <button
//         onClick={() => setShowSignInModal(true)}
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//       >
//         SignIn
//       </button>

//       {/* Copy / Paste */}
//       <button
//         onClick={handleCopyPasteToggle}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap ${mode === 'copy'
//           ? 'bg-yellow-100 text-yellow-800'
//           : mode === 'paste'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-white hover:bg-gray-100'
//           }`}
//       >
//         {mode === 'off' && 'Copy'}
//         {mode === 'copy' && `Copy (${copiedEvents.length})`}
//         {mode === 'paste' && 'Paste'}
//       </button>

//       {/* Delete Mode */}
//       <button
//         onClick={() => dispatch(toggleDeleteMode())}
//         className={`border text-xs px-3 py-1.5 font-medium shadow-sm transition whitespace-nowrap rounded-md ${deleteMode
//           ? 'bg-red-600 text-white hover:bg-red-700'
//           : 'bg-gray-700 text-white hover:bg-gray-800'
//           }`}
//       >
//         Delete
//       </button>

//       {/* Penalty */}
//       <button
//         onClick={() => setShowPenaltyModal(true)}
//         className="bg-white border text-xs px-3 py-1.5 font-medium shadow-sm hover:bg-gray-100 transition whitespace-nowrap"
//       >
//         Penalty
//       </button>

//       <PenaltyModal
//         isOpen={showPenaltyModal}
//         onClose={() => setShowPenaltyModal(false)}
//       />

//       {/* Bottom Info Bars */}
//       <div className="flex gap-1 justify-center items-center">
//         {nextScheduleTime ? (
//           <div className="mt-2 w-full flex justify-center">
//             <div className="flex items-center gap-2 bg-blue-50 border-blue-300 text-blue-700 text-sm rounded-lg px-4 py-2 shadow-sm">
//               <span>
//                 Next verification at:{" "}
//                 <span className="font-semibold">
//                   {nextScheduleTime.toLocaleString("en-IN", {
//                     timeZone: "Asia/Kolkata",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                     day: "numeric",
//                     month: "short",
//                     weekday: "short",
//                   })}
//                 </span>
//               </span>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-2 w-[70%] justify-center bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm rounded-lg px-4 py-2 shadow-sm flex items-center gap-2">
//             No upcoming accountability scheduled
//           </div>
//         )}

//         {lockedUntil && new Date(lockedUntil) > new Date() ? (
//           <div className="mt-1 px-2 py-1 bg-gray-100 border rounded text-sm text-gray-700 shadow-sm">
//             Locked until:{" "}
//             <span className="font-medium">
//               {lockedUntil.toLocaleTimeString("en-IN", {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true,
//               })},{" "}
//               {lockedUntil.toLocaleDateString("en-IN", {
//                 weekday: 'short',
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric',
//               })}
//             </span>
//           </div>
//         ) : (
//           <div className="mt-1 px-2 py-1 bg-green-50 border-green-300 rounded text-sm text-green-800 shadow-sm">
//             Free to Edit — No Strict Mode Active
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <StrictModeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//       <RepeatModal isOpen={showRepeatModal} onClose={() => setShowRepeatModal(false)} />
//       <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />
//     </div>
//   );
// };

// export default CalendarControls;
