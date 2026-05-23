
// // hooks/useSocket.js
// import { useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { addEventsToRedux } from '../ReduxToolkit/Slices/CalendarSlice';

// export const useSocket = () => {
//   const socketRef = useRef(null);
//   const internalSocketRef = useRef(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // External Socket (ws://localhost:3001)
//     const socket = new WebSocket('ws://localhost:3001');

//     socket.onopen = () => {
//       console.log(' Main WebSocket Connected (3001)');
//       socket.send(JSON.stringify({ type: 'init', userId: 'user1' }));
//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log(' Message from server (3001):', data);

//         const payload = data.payload;

//         if (payload) {
//           dispatch(addEventsToRedux({
//             ...payload,
//             fromDb: true
//           }));
//         }


//       } catch (err) {
//         console.error('❌ Main WS parse error:', err);
//       }
//     };

//     socket.onerror = (err) => {
//       console.error(' Main WebSocket error:', err);
//     };

//     socket.onclose = () => {
//       console.warn(' Main WebSocket closed');
//     };

//     socketRef.current = socket;

//     //  Internal Socket (ws://localhost:3005)...................................................................................................
//     const internalSocket = new WebSocket('ws://localhost:3005');

//     internalSocket.onopen = () => {
//       console.log(' Internal WebSocket Connected (3005)');
//       internalSocket.send(JSON.stringify({ type: 'internal-init', userId: 'user1' }));
//     };

//     internalSocket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         console.log(' Message from INTERNAL server (3005):', data);

//         if (data.type === 'next-schedule-updated') {
//           console.log(" Received next schedule time");
//           localStorage.setItem("nextScheduleTime", data.nextScheduledAt);
//           window.dispatchEvent(new Event("nextScheduleUpdated"));
//         }

//       } catch (err) {
//         console.error(' Internal WS parse error:', err);
//       }
//     };


//     internalSocket.onerror = (err) => {
//       console.error('Internal WebSocket error:', err);
//     };

//     internalSocket.onclose = () => {
//       console.warn('Internal WebSocket closed');
//     };

//     internalSocketRef.current = internalSocket;

//     return () => {
//       socket.close();
//       internalSocket.close();
//     };
//   }, [dispatch]);

//   return { socketRef, internalSocketRef }; // Return both if needed
// };




import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addEventsToRedux } from '../ReduxToolkit/Slices/CalendarSlice';

export const useSocket = () => {
  const socketRef = useRef(null);
  const internalSocketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const externalSocketURL = import.meta.env.VITE_WS_EXTERNAL_URL;
    const internalSocketURL = import.meta.env.VITE_WS_INTERNAL_URL;

    // External
    const socket = new WebSocket(externalSocketURL);
    socket.onopen = () => {
      console.log(' Main WebSocket Connected (3001)');
      socket.send(JSON.stringify({ type: 'init', userId: 'user1' }));
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(' Message from server (3001):', data);
        const payload = data.payload;
        if (payload) {
          dispatch(addEventsToRedux({ ...payload, fromDb: true }));
        }
      } catch (err) {
        console.error('❌ Main WS parse error:', err);
      }
    };
    socket.onerror = (err) => console.error(' Main WebSocket error:', err);
    socket.onclose = () => console.warn(' Main WebSocket closed');
    socketRef.current = socket;

    // Internal
    const internalSocket = new WebSocket(internalSocketURL);
    internalSocket.onopen = () => {
      console.log(' Internal WebSocket Connected (3005)');
      internalSocket.send(JSON.stringify({ type: 'internal-init', userId: 'user1' }));
    };
    internalSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(' Message from INTERNAL server (3005):', data);
        if (data.type === 'next-schedule-updated') {
          localStorage.setItem("nextScheduleTime", data.nextScheduledAt);
          window.dispatchEvent(new Event("nextScheduleUpdated"));
        }
      } catch (err) {
        console.error(' Internal WS parse error:', err);
      }
    };
    internalSocket.onerror = (err) => console.error('Internal WebSocket error:', err);
    internalSocket.onclose = () => console.warn('Internal WebSocket closed');
    internalSocketRef.current = internalSocket;

    return () => {
      socket.close();
      internalSocket.close();
    };
  }, [dispatch]);

  return { socketRef, internalSocketRef };
};

