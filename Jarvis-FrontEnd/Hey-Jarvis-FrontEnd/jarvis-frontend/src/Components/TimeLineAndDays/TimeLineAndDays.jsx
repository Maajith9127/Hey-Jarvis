
// import React from 'react';
// import Calendarr from './Calendar.jsx';
// import CalendarControls from './CalendarControls.jsx';

// const TimeLineAndDays = () => {
//   return (
//     <div className="bg-white border border-slate-200 shadow-md flex flex-col h-full overflow-hidden">
//       {/* Controls row */}
//       <div className=" borde border-slate-200">
//         <CalendarControls />
//       </div>

//       {/* Calendar content */}
//       <div className=" overflow-x-scroll overflow-y-hidden bg-white">
//         <div className="min-w-[900px]    ">
//           <Calendarr />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimeLineAndDays;







import React, { useEffect, useRef } from 'react';
import Calendarr from './Calendar.jsx';
import CalendarControls from './CalendarControls.jsx';

const TimeLineAndDays = () => {
  const scrollRef = useRef();

  //  Restore scroll on mount
  useEffect(() => {
    const savedScroll = localStorage.getItem("timelineScrollLeft");
    if (scrollRef.current && savedScroll) {
      scrollRef.current.scrollLeft = parseInt(savedScroll, 10);
    }
  }, []);

  //  Save scroll on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        localStorage.setItem("timelineScrollLeft", scrollRef.current.scrollLeft);
      }
    };

    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollDiv) {
        scrollDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="bg-white border border-slate-200 shadow-md flex flex-col h-full overflow-hidden">
      {/* Controls row */}
      <div className="borde border-slate-200">
        <CalendarControls />
      </div>

      {/* Calendar content */}
      <div
        ref={scrollRef}
        className="overflow-x-scroll  overflow-y-hidden bg-white"
      >
        <div className="min-w-[900px]">
          <Calendarr />
        </div>
      </div>
    </div>
  );
};

export default TimeLineAndDays;
