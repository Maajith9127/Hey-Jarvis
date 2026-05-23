
// import Accountability from "./Components/Accountability/Accountability";
// import TimeLineAndDays from "./Components/TimeLineAndDays/TimeLineAndDays";
// import ToDos from "./Components/ToDos/ToDos";
// import { useDispatch } from "react-redux";
// import useDraggableElements from './hooks/useDraggableElements.js';
// import useFetchAllData from './hooks/useFetchAllData.js';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useSocket } from "./hooks/useSocket.js";
// import Footer from "./Components/Common/Footer.jsx";

// function App() {
//   const dispatch = useDispatch();
//   useDraggableElements();
//   useFetchAllData();
//   useSocket();

//   return (
//     <div className="flex flex-col min-h-screen   ">
//       <div className="flex-1 flex flex-col md:grid md:grid-cols-4">

//         {/* Todos on left */}
//         <div className="order-2 md:order-none md:col-span-1  md:mb-0">
//           <ToDos />
//         </div>

//         {/* Calendar in center */}
//         <div className="order-1 md:order-none md:col-span-2 flex flex-col max-h-[80vh] md:min-h-[100%]  ">
//           <TimeLineAndDays />
//         </div>

//         {/* Accountability on right */}
//         <div className="order-3 md:order-none md:col-span-1">
//           <Accountability />
//         </div>
//       </div>

//       <ToastContainer
//         position="top-center"
//         theme="colored"
//         autoClose={3000}
//         className="z-[9999] mb-6"
//       />
//     </div>
//   );
// }

// export default App;




import Accountability from "./Components/Accountability/Accountability";
import TimeLineAndDays from "./Components/TimeLineAndDays/TimeLineAndDays";
import ToDos from "./Components/ToDos/ToDos";
import { useDispatch } from "react-redux";
import useDraggableElements from './hooks/useDraggableElements.js';
import useFetchAllData from './hooks/useFetchAllData.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from "./hooks/useSocket.js";
import Footer from "./Components/Common/Footer.jsx";

function App() {
  const dispatch = useDispatch();
  useDraggableElements();
  useFetchAllData();
  useSocket();

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-4">
        {/* Todos on left */}
        <div className="order-2 md:order-none md:col-span-1 md:mb-0">
          <ToDos />
        </div>

        {/* Calendar in center */}
        <div className="order-1 md:order-none md:col-span-2 flex flex-col max-h-[80vh] md:min-h-[100%]">
          <TimeLineAndDays />
        </div>

        {/* Accountability on right */}
        <div className="order-3 md:order-none md:col-span-1">
          <Accountability />
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={3000}
        className="z-[9999] mb-6"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
