// // import React, { useState, useEffect } from "react";
// // import {
// //     getUserPenalties,
// //     getCaptcha,
// //     verifyCaptcha,
// // } from "../../services/penaltyService.js";

// // const PenaltyModal = ({ isOpen, onClose }) => {
// //     const [penalties, setPenalties] = useState([]);
// //     const [selectedPenalty, setSelectedPenalty] = useState(null);
// //     const [captchaSvg, setCaptchaSvg] = useState(null);
// //     const [answer, setAnswer] = useState("");
// //     const [loading, setLoading] = useState(false);

// //     // Load penalties on open
// //     useEffect(() => {
// //         if (isOpen) {
// //             getUserPenalties()
// //                 .then((data) => {
// //                     setPenalties(data || []);
// //                     if (data.length > 0) {
// //                         setSelectedPenalty({
// //                             AccountabilityId: data[0].AccountabilityId,
// //                             SpecificEventId: data[0].SpecificEventId,
// //                         });
// //                     }
// //                 })
// //                 .catch((err) => console.error("Failed to load penalties:", err));
// //         }
// //     }, [isOpen]);

// //     if (!isOpen) return null;

// //     const handleGenerateCaptcha = async () => {
// //         if (!selectedPenalty) return;
// //         setLoading(true);
// //         try {
// //             const res = await getCaptcha(
// //                 selectedPenalty.AccountabilityId,
// //                 selectedPenalty.SpecificEventId
// //             );
// //             setCaptchaSvg(res.captcha); // backend sends SVG string
// //         } catch (err) {
// //             console.error("Failed to get captcha:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleSubmit = async () => {
// //         if (!selectedPenalty || !answer) return;
// //         setLoading(true);
// //         try {
// //             const res = await verifyCaptcha(
// //                 selectedPenalty.AccountabilityId,
// //                 selectedPenalty.SpecificEventId,
// //                 answer
// //             );

// //             // Update solved count locally
// //             setPenalties((prev) =>
// //                 prev.map((p) =>
// //                     p.AccountabilityId === selectedPenalty.AccountabilityId &&
// //                         p.SpecificEventId === selectedPenalty.SpecificEventId
// //                         ? { ...p, solvedCount: res.solvedCount }
// //                         : p
// //                 )
// //             );

// //             setAnswer("");
// //             setCaptchaSvg(null);
// //         } catch (err) {
// //             console.error("Failed to verify captcha:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const activePenalty =
// //         penalties.find(
// //             (p) =>
// //                 p.AccountabilityId === selectedPenalty?.AccountabilityId &&
// //                 p.SpecificEventId === selectedPenalty?.SpecificEventId
// //         ) || null;

// //     const progressPercent = activePenalty
// //         ? Math.min((activePenalty.solvedCount / 170) * 100, 100)
// //         : 0;

// //     return (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
// //             <div className="bg-white/95 p-6 rounded-2xl shadow-xl w-[500px] border border-gray-200">
// //                 <h2 className="text-lg font-semibold mb-4">Penalty Redemption</h2>

// //                 {/* Penalty List */}
// //                 <div className="mb-4">
// //                     {penalties.length === 0 && (
// //                         <p className="text-gray-500 text-sm">No active penalties 🎉</p>
// //                     )}
// //                     {penalties.map((p) => (
// //                         <label
// //                             key={`${p.AccountabilityId}-${p.SpecificEventId}`}
// //                             className="block mb-1 text-sm"
// //                         >
// //                             <input
// //                                 type="radio"
// //                                 name="penalty"
// //                                 checked={
// //                                     selectedPenalty?.AccountabilityId === p.AccountabilityId &&
// //                                     selectedPenalty?.SpecificEventId === p.SpecificEventId
// //                                 }
// //                                 onChange={() =>
// //                                     setSelectedPenalty({
// //                                         AccountabilityId: p.AccountabilityId,
// //                                         SpecificEventId: p.SpecificEventId,
// //                                     })
// //                                 }
// //                                 className="mr-2"
// //                             />
// //                             {p.AccountabilityId} | Event {p.SpecificEventId} — solved{" "}
// //                             {p.solvedCount}/170
// //                         </label>
// //                     ))}
// //                 </div>

// //                 {/* Debug: Show raw penalty JSON */}
// //                 {activePenalty && (
// //                     <div className="mb-4">
// //                         <p className="text-sm font-medium text-gray-700 mb-1">Penalty Doc (Raw)</p>
// //                         <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto max-h-40">
// //                             {JSON.stringify(activePenalty, null, 2)}
// //                         </pre>
// //                     </div>
// //                 )}

// //                 {/* Progress Bar */}
// //                 {activePenalty && (
// //                     <div className="mb-4">
// //                         <p className="text-sm text-gray-600 mb-1">
// //                             {activePenalty.solvedCount}/170 captchas solved
// //                         </p>
// //                         <div className="w-full h-3 bg-gray-200 rounded">
// //                             <div
// //                                 className="h-3 bg-blue-600 rounded"
// //                                 style={{ width: `${progressPercent}%` }}
// //                             ></div>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Captcha */}
// //                 <div className="flex justify-center items-center h-32 border mb-4 bg-gray-50 rounded">
// //                     {captchaSvg ? (
// //                         <div
// //                             dangerouslySetInnerHTML={{ __html: captchaSvg }}
// //                             className="w-full flex justify-center"
// //                         />
// //                     ) : (
// //                         <span className="text-gray-400">[No Captcha Yet]</span>
// //                     )}
// //                 </div>

// //                 {/* Input */}
// //                 <input
// //                     type="text"
// //                     value={answer}
// //                     onChange={(e) => setAnswer(e.target.value)}
// //                     className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                     placeholder="Enter captcha text"
// //                 />

// //                 {/* Actions */}
// //                 <div className="flex justify-between">
// //                     <button
// //                         onClick={handleGenerateCaptcha}
// //                         className="px-4 py-2 border rounded hover:bg-gray-100 transition"
// //                         disabled={!selectedPenalty || loading}
// //                     >
// //                         Get Captcha
// //                     </button>
// //                     <div className="flex gap-2">
// //                         <button
// //                             onClick={onClose}
// //                             className="px-4 py-2 border rounded hover:bg-gray-100 transition"
// //                         >
// //                             Cancel
// //                         </button>
// //                         <button
// //                             onClick={handleSubmit}
// //                             disabled={!answer || loading}
// //                             className={`px-4 py-2 rounded text-white transition ${answer
// //                                 ? "bg-blue-600 hover:bg-blue-700"
// //                                 : "bg-gray-400 cursor-not-allowed"
// //                                 }`}
// //                         >
// //                             Submit
// //                         </button>
// //                     </div>
// //                 </div>





// //             </div>
// //         </div>
// //     );
// // };

// // export default PenaltyModal;




// import React, { useState, useEffect } from "react";
// import {
//     getUserPenalties,
//     getCaptcha,
//     verifyCaptcha,
// } from "../../services/penaltyService.js";

// const PenaltyModal = ({ isOpen, onClose }) => {
//     const [penalties, setPenalties] = useState([]);
//     const [selectedPenalty, setSelectedPenalty] = useState(null);
//     const [captchaSvg, setCaptchaSvg] = useState(null);
//     const [answer, setAnswer] = useState("");
//     const [loading, setLoading] = useState(false);

//     // Load penalties on open
//     useEffect(() => {
//         if (isOpen) {
//             getUserPenalties()
//                 .then((data) => {
//                     setPenalties(data || []);
//                     const firstPending = data.find((p) => p.status === "pending");
//                     if (firstPending) {
//                         setSelectedPenalty({
//                             AccountabilityId: firstPending.AccountabilityId,
//                             SpecificEventId: firstPending.SpecificEventId,
//                         });
//                     }
//                 })
//                 .catch((err) => console.error("Failed to load penalties:", err));
//         }
//     }, [isOpen]);

//     if (!isOpen) return null;

//     const handleGenerateCaptcha = async () => {
//         if (!selectedPenalty) return;
//         setLoading(true);
//         try {
//             const res = await getCaptcha(
//                 selectedPenalty.AccountabilityId,
//                 selectedPenalty.SpecificEventId
//             );
//             setCaptchaSvg(res.captcha); // backend sends SVG string
//         } catch (err) {
//             console.error("Failed to get captcha:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!selectedPenalty || !answer) return;
//         setLoading(true);
//         try {
//             const res = await verifyCaptcha(
//                 selectedPenalty.AccountabilityId,
//                 selectedPenalty.SpecificEventId,
//                 answer
//             );

//             // ✅ Update only the verified penalty
//             setPenalties((prev) =>
//                 prev.map((p) =>
//                     p.AccountabilityId === res.AccountabilityId &&
//                         p.SpecificEventId === res.SpecificEventId
//                         ? { ...p, solvedCount: res.solvedCount }
//                         : p
//                 )
//             );

//             setAnswer("");
//             setCaptchaSvg(null);
//         } catch (err) {
//             console.error("Failed to verify captcha:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const activePenalty =
//         penalties.find(
//             (p) =>
//                 p.AccountabilityId === selectedPenalty?.AccountabilityId &&
//                 p.SpecificEventId === selectedPenalty?.SpecificEventId
//         ) || null;

//     const progressPercent = activePenalty
//         ? Math.min((activePenalty.solvedCount / 170) * 100, 100)
//         : 0;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//             <div className="bg-white/95 p-6 rounded-2xl shadow-xl w-[600px] border border-gray-200 max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-lg font-semibold mb-4">Penalty Redemption</h2>

//                 {/* Pending Penalty Selection */}
//                 <div className="mb-4">
//                     <h3 className="font-medium text-sm mb-2">Pending Penalties</h3>
//                     {penalties.filter((p) => p.status === "pending").length === 0 && (
//                         <p className="text-gray-500 text-sm">No active penalties 🎉</p>
//                     )}
//                     {penalties
//                         .filter((p) => p.status === "pending")
//                         .map((p) => (
//                             <label
//                                 key={`${p.AccountabilityId}-${p.SpecificEventId}`}
//                                 className="block mb-1 text-sm"
//                             >
//                                 <input
//                                     type="radio"
//                                     name="penalty"
//                                     checked={
//                                         selectedPenalty?.AccountabilityId ===
//                                         p.AccountabilityId &&
//                                         selectedPenalty?.SpecificEventId ===
//                                         p.SpecificEventId
//                                     }
//                                     onChange={() =>
//                                         setSelectedPenalty({
//                                             AccountabilityId: p.AccountabilityId,
//                                             SpecificEventId: p.SpecificEventId,
//                                         })
//                                     }
//                                     className="mr-2"
//                                 />
//                                 {p.AccountabilityId} | Event {p.SpecificEventId} — solved{" "}
//                                 {p.solvedCount}/170
//                             </label>
//                         ))}
//                 </div>

//                 {/* Progress Bar */}
//                 {activePenalty && (
//                     <div className="mb-4">
//                         <p className="text-sm text-gray-600 mb-1">
//                             {activePenalty.solvedCount}/170 captchas solved
//                         </p>
//                         <div className="w-full h-3 bg-gray-200 rounded">
//                             <div
//                                 className="h-3 bg-blue-600 rounded"
//                                 style={{ width: `${progressPercent}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Captcha */}
//                 <div className="flex justify-center items-center h-32 border mb-4 bg-gray-50 rounded">
//                     {captchaSvg ? (
//                         <div
//                             dangerouslySetInnerHTML={{ __html: captchaSvg }}
//                             className="w-full flex justify-center"
//                         />
//                     ) : (
//                         <span className="text-gray-400">[No Captcha Yet]</span>
//                     )}
//                 </div>

//                 {/* Input */}
//                 <input
//                     type="text"
//                     value={answer}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter captcha text"
//                 />

//                 {/* Actions */}
//                 <div className="flex justify-between mb-6">
//                     <button
//                         onClick={handleGenerateCaptcha}
//                         className="px-4 py-2 border rounded hover:bg-gray-100 transition"
//                         disabled={!selectedPenalty || loading}
//                     >
//                         Get Captcha
//                     </button>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={onClose}
//                             className="px-4 py-2 border rounded hover:bg-gray-100 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             disabled={!answer || loading}
//                             className={`px-4 py-2 rounded text-white transition ${answer
//                                 ? "bg-blue-600 hover:bg-blue-700"
//                                 : "bg-gray-400 cursor-not-allowed"
//                                 }`}
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </div>

//                 {/* Penalty History (All) */}
//                 {/* Penalty History (All) */}
//                 <div>
//                     <h3 className="font-medium text-sm mb-2">Penalty History</h3>
//                     {penalties.length === 0 ? (
//                         <p className="text-gray-500 text-sm">No penalties recorded.</p>
//                     ) : (
//                         <div className="max-h-48 overflow-y-auto border rounded">
//                             <table className="w-full text-sm">
//                                 <thead className="sticky top-0 bg-gray-100">
//                                     <tr className="text-left">
//                                         <th className="p-2 border">AccountabilityId</th>
//                                         <th className="p-2 border">EventId</th>
//                                         <th className="p-2 border">Solved</th>
//                                         <th className="p-2 border">Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {penalties.map((p) => (
//                                         <tr key={`${p.AccountabilityId}-${p.SpecificEventId}`}>
//                                             <td className="p-2 border">{p.AccountabilityId}</td>
//                                             <td className="p-2 border">{p.SpecificEventId}</td>
//                                             <td className="p-2 border">{p.solvedCount}/170</td>
//                                             <td
//                                                 className={`p-2 border ${p.status === "waived"
//                                                         ? "text-green-600"
//                                                         : p.status === "enforced"
//                                                             ? "text-red-600"
//                                                             : "text-yellow-600"
//                                                     }`}
//                                             >
//                                                 {p.status}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default PenaltyModal;



// import React, { useState, useEffect } from "react";
// import {
//     getUserPenalties,
//     getCaptcha,
//     verifyCaptcha,
// } from "../../services/penaltyService.js";

// const PenaltyModal = ({ isOpen, onClose }) => {
//     const [penalties, setPenalties] = useState([]);
//     const [selectedPenalty, setSelectedPenalty] = useState(null);
//     const [captchaSvg, setCaptchaSvg] = useState(null);
//     const [answer, setAnswer] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [now, setNow] = useState(Date.now()); // ⏰ local clock

//     // keep ticking every second
//     useEffect(() => {
//         const timer = setInterval(() => setNow(Date.now()), 1000);
//         return () => clearInterval(timer);
//     }, []);

//     // Load penalties on open
//     useEffect(() => {
//         if (isOpen) {
//             getUserPenalties()
//                 .then((data) => {
//                     setPenalties(data || []);
//                     const firstPending = data.find((p) => p.status === "pending");
//                     if (firstPending) {
//                         setSelectedPenalty({
//                             AccountabilityId: firstPending.AccountabilityId,
//                             SpecificEventId: firstPending.SpecificEventId,
//                         });
//                     }
//                 })
//                 .catch((err) => console.error("Failed to load penalties:", err));
//         }
//     }, [isOpen]);

//     if (!isOpen) return null;

//     const handleGenerateCaptcha = async () => {
//         if (!selectedPenalty) return;
//         setLoading(true);
//         try {
//             const res = await getCaptcha(
//                 selectedPenalty.AccountabilityId,
//                 selectedPenalty.SpecificEventId
//             );
//             setCaptchaSvg(res.captcha);
//         } catch (err) {
//             console.error("Failed to get captcha:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         if (!selectedPenalty || !answer) return;
//         setLoading(true);
//         try {
//             const res = await verifyCaptcha(
//                 selectedPenalty.AccountabilityId,
//                 selectedPenalty.SpecificEventId,
//                 answer
//             );

//             setPenalties((prev) =>
//                 prev.map((p) =>
//                     p.AccountabilityId === res.AccountabilityId &&
//                         p.SpecificEventId === res.SpecificEventId
//                         ? { ...p, solvedCount: res.solvedCount }
//                         : p
//                 )
//             );

//             setAnswer("");
//             setCaptchaSvg(null);
//         } catch (err) {
//             console.error("Failed to verify captcha:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const activePenalty =
//         penalties.find(
//             (p) =>
//                 p.AccountabilityId === selectedPenalty?.AccountabilityId &&
//                 p.SpecificEventId === selectedPenalty?.SpecificEventId
//         ) || null;

//     const solveThreshold = parseInt(process.env.REACT_APP_CAPTCHA_SOLVE_THRESHOLD || "170", 10);
//     const progressPercent = activePenalty
//         ? Math.min((activePenalty.solvedCount / solveThreshold) * 100, 100)
//         : 0;

//     // ⏳ Time remaining calc
//     const formatRemaining = (expiresAt) => {
//         if (!expiresAt) return "—";
//         const diff = new Date(expiresAt).getTime() - now;
//         if (diff <= 0) return "Expired";
//         const mins = Math.floor(diff / 60000);
//         const secs = Math.floor((diff % 60000) / 1000);
//         return `${mins}m ${secs}s remaining`;
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//             <div className="bg-white/95 p-6 rounded-2xl shadow-xl w-[600px] border border-gray-200 max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-lg font-semibold mb-4">Penalty Redemption</h2>

//                 {/* Pending Penalty Selection */}
//                 <div className="mb-4">
//                     <h3 className="font-medium text-sm mb-2">Pending Penalties</h3>
//                     {penalties.filter((p) => p.status === "pending").length === 0 && (
//                         <p className="text-gray-500 text-sm">No active penalties 🎉</p>
//                     )}
//                     {penalties
//                         .filter((p) => p.status === "pending")
//                         .map((p) => (
//                             <label
//                                 key={`${p.AccountabilityId}-${p.SpecificEventId}`}
//                                 className="block mb-1 text-sm"
//                             >
//                                 <input
//                                     type="radio"
//                                     name="penalty"
//                                     checked={
//                                         selectedPenalty?.AccountabilityId ===
//                                         p.AccountabilityId &&
//                                         selectedPenalty?.SpecificEventId ===
//                                         p.SpecificEventId
//                                     }
//                                     onChange={() =>
//                                         setSelectedPenalty({
//                                             AccountabilityId: p.AccountabilityId,
//                                             SpecificEventId: p.SpecificEventId,
//                                         })
//                                     }
//                                     className="mr-2"
//                                 />
//                                 {p.AccountabilityId} | Event {p.SpecificEventId} — solved{" "}
//                                 {p.solvedCount}/{solveThreshold} •{" "}
//                                 <span className="text-gray-600">
//                                     {formatRemaining(p.expiresAt)}
//                                 </span>
//                             </label>
//                         ))}
//                 </div>

//                 {/* Progress Bar */}
//                 {activePenalty && (
//                     <div className="mb-4">
//                         <p className="text-sm text-gray-600 mb-1">
//                             {activePenalty.solvedCount}/{solveThreshold} captchas solved
//                         </p>
//                         <div className="w-full h-3 bg-gray-200 rounded">
//                             <div
//                                 className="h-3 bg-blue-600 rounded"
//                                 style={{ width: `${progressPercent}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Captcha */}
//                 <div className="flex justify-center items-center h-32 border mb-4 bg-gray-50 rounded">
//                     {captchaSvg ? (
//                         <div
//                             dangerouslySetInnerHTML={{ __html: captchaSvg }}
//                             className="w-full flex justify-center"
//                         />
//                     ) : (
//                         <span className="text-gray-400">[No Captcha Yet]</span>
//                     )}
//                 </div>

//                 {/* Input */}
//                 <input
//                     type="text"
//                     value={answer}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     placeholder="Enter captcha text"
//                 />

//                 {/* Actions */}
//                 <div className="flex justify-between mb-6">
//                     <button
//                         onClick={handleGenerateCaptcha}
//                         className="px-4 py-2 border rounded hover:bg-gray-100 transition"
//                         disabled={!selectedPenalty || loading}
//                     >
//                         Get Captcha
//                     </button>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={onClose}
//                             className="px-4 py-2 border rounded hover:bg-gray-100 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             disabled={!answer || loading}
//                             className={`px-4 py-2 rounded text-white transition ${answer
//                                     ? "bg-blue-600 hover:bg-blue-700"
//                                     : "bg-gray-400 cursor-not-allowed"
//                                 }`}
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </div>

//                 {/* Penalty History */}
//                 <div>
//                     <h3 className="font-medium text-sm mb-2">Penalty History</h3>
//                     {penalties.length === 0 ? (
//                         <p className="text-gray-500 text-sm">No penalties recorded.</p>
//                     ) : (
//                         <div className="max-h-48 overflow-y-auto border rounded">
//                             <table className="w-full text-sm">
//                                 <thead className="sticky top-0 bg-gray-100">
//                                     <tr className="text-left">
//                                         <th className="p-2 border">AccountabilityId</th>
//                                         <th className="p-2 border">EventId</th>
//                                         <th className="p-2 border">Solved</th>
//                                         <th className="p-2 border">Status</th>
//                                         <th className="p-2 border">Expires</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {penalties.map((p) => (
//                                         <tr key={`${p.AccountabilityId}-${p.SpecificEventId}`}>
//                                             <td className="p-2 border">{p.AccountabilityId}</td>
//                                             <td className="p-2 border">{p.SpecificEventId}</td>
//                                             <td className="p-2 border">{p.solvedCount}/{solveThreshold}</td>
//                                             <td
//                                                 className={`p-2 border ${p.status === "waived"
//                                                         ? "text-green-600"
//                                                         : p.status === "enforced"
//                                                             ? "text-red-600"
//                                                             : "text-yellow-600"
//                                                     }`}
//                                             >
//                                                 {p.status}
//                                             </td>
//                                             <td className="p-2 border">
//                                                 {formatRemaining(p.expiresAt)}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PenaltyModal;




import React, { useState, useEffect } from "react";
import {
    getUserPenalties,
    getCaptcha,
    verifyCaptcha,
} from "../../services/penaltyService.js";

// ✅ Read threshold from Vite env (default 10 if missing)
const solveThreshold = parseInt(
    import.meta.env.VITE_CAPTCHA_SOLVE_THRESHOLD || "10",
    10
);

const PenaltyModal = ({ isOpen, onClose }) => {
    const [penalties, setPenalties] = useState([]);
    const [selectedPenalty, setSelectedPenalty] = useState(null);
    const [captchaSvg, setCaptchaSvg] = useState(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    // ⏳ Timer updater for remaining time
    useEffect(() => {
        if (!selectedPenalty) return;

        const penalty = penalties.find(
            (p) =>
                p.AccountabilityId === selectedPenalty.AccountabilityId &&
                p.SpecificEventId === selectedPenalty.SpecificEventId
        );

        if (!penalty || !penalty.expiresAt) return;

        const update = () => {
            const now = Date.now();
            const expiresAt = new Date(penalty.expiresAt).getTime();
            const diff = expiresAt - now;
            if (diff <= 0) {
                setTimeLeft("Expired");
            } else {
                const mins = Math.floor(diff / 60000);
                const secs = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${mins}m ${secs}s`);
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [selectedPenalty, penalties]);

    // Load penalties on open
    useEffect(() => {
        if (isOpen) {
            getUserPenalties()
                .then((data) => {
                    setPenalties(data || []);
                    const firstPending = data.find((p) => p.status === "pending");
                    if (firstPending) {
                        setSelectedPenalty({
                            AccountabilityId: firstPending.AccountabilityId,
                            SpecificEventId: firstPending.SpecificEventId,
                        });
                    }
                })
                .catch((err) => console.error("Failed to load penalties:", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerateCaptcha = async () => {
        if (!selectedPenalty) return;
        setLoading(true);
        try {
            const res = await getCaptcha(
                selectedPenalty.AccountabilityId,
                selectedPenalty.SpecificEventId
            );
            setCaptchaSvg(res.captcha);
        } catch (err) {
            console.error("Failed to get captcha:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPenalty || !answer) return;
        setLoading(true);
        try {
            const res = await verifyCaptcha(
                selectedPenalty.AccountabilityId,
                selectedPenalty.SpecificEventId,
                answer
            );

            setPenalties((prev) =>
                prev.map((p) =>
                    p.AccountabilityId === res.AccountabilityId &&
                        p.SpecificEventId === res.SpecificEventId
                        ? { ...p, solvedCount: res.solvedCount }
                        : p
                )
            );

            setAnswer("");
            setCaptchaSvg(null);
        } catch (err) {
            console.error("Failed to verify captcha:", err);
        } finally {
            setLoading(false);
        }
    };

    const activePenalty =
        penalties.find(
            (p) =>
                p.AccountabilityId === selectedPenalty?.AccountabilityId &&
                p.SpecificEventId === selectedPenalty?.SpecificEventId
        ) || null;

    const progressPercent = activePenalty
        ? Math.min((activePenalty.solvedCount / solveThreshold) * 100, 100)
        : 0;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white/95 p-6 rounded-2xl shadow-xl w-[600px] border border-gray-200 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Penalty Redemption</h2>

                {/* Pending Penalty Selection */}
                <div className="mb-4">
                    <h3 className="font-medium text-sm mb-2">Pending Penalties</h3>
                    {penalties.filter((p) => p.status === "pending").length === 0 && (
                        <p className="text-gray-500 text-sm">No active penalties 🎉</p>
                    )}
                    {penalties
                        .filter((p) => p.status === "pending")
                        .map((p) => (
                            <label
                                key={`${p.AccountabilityId}-${p.SpecificEventId}`}
                                className="block mb-1 text-sm"
                            >
                                <input
                                    type="radio"
                                    name="penalty"
                                    checked={
                                        selectedPenalty?.AccountabilityId ===
                                        p.AccountabilityId &&
                                        selectedPenalty?.SpecificEventId ===
                                        p.SpecificEventId
                                    }
                                    onChange={() =>
                                        setSelectedPenalty({
                                            AccountabilityId: p.AccountabilityId,
                                            SpecificEventId: p.SpecificEventId,
                                        })
                                    }
                                    className="mr-2"
                                />
                                {p.AccountabilityId} | Event {p.SpecificEventId} — solved{" "}
                                {p.solvedCount}/{solveThreshold}
                            </label>
                        ))}
                </div>

                {/* Progress Bar */}
                {activePenalty && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                            {activePenalty.solvedCount}/{solveThreshold} captchas solved
                        </p>
                        <div className="w-full h-3 bg-gray-200 rounded">
                            <div
                                className="h-3 bg-blue-600 rounded"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        {timeLeft && (
                            <p className="text-xs text-gray-500 mt-1">
                                ⏳ Time Remaining: {timeLeft}
                            </p>
                        )}
                    </div>
                )}

                {/* Captcha */}
                <div className="flex justify-center items-center h-32 border mb-4 bg-gray-50 rounded">
                    {captchaSvg ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: captchaSvg }}
                            className="w-full flex justify-center"
                        />
                    ) : (
                        <span className="text-gray-400">[No Captcha Yet]</span>
                    )}
                </div>

                {/* Input */}
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter captcha text"
                />

                {/* Actions */}
                <div className="flex justify-between mb-6">
                    <button
                        onClick={handleGenerateCaptcha}
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        disabled={!selectedPenalty || loading}
                    >
                        Get Captcha
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!answer || loading}
                            className={`px-4 py-2 rounded text-white transition ${answer
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Penalty History */}
                <div>
                    <h3 className="font-medium text-sm mb-2">Penalty History</h3>
                    {penalties.length === 0 ? (
                        <p className="text-gray-500 text-sm">No penalties recorded.</p>
                    ) : (
                        <div className="max-h-48 overflow-y-auto border rounded">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr className="text-left">
                                        <th className="p-2 border">AccountabilityId</th>
                                        <th className="p-2 border">EventId</th>
                                        <th className="p-2 border">Solved</th>
                                        <th className="p-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {penalties.map((p) => (
                                        <tr key={`${p.AccountabilityId}-${p.SpecificEventId}`}>
                                            <td className="p-2 border">{p.AccountabilityId}</td>
                                            <td className="p-2 border">{p.SpecificEventId}</td>
                                            <td className="p-2 border">
                                                {p.solvedCount}/{solveThreshold}
                                            </td>
                                            <td
                                                className={`p-2 border ${p.status === "waived"
                                                    ? "text-green-600"
                                                    : p.status === "enforced"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {p.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PenaltyModal;
