
import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addToCopyBuffer } from "../../ReduxToolkit/Slices/CopyPasteSlice.jsx";
import {
    addEventsToRedux,
    updateEventInRedux,
    deleteEventFromRedux,
} from '../../ReduxToolkit/Slices/CalendarSlice.jsx';
import { store } from "../../ReduxToolkit/store.js";

const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hr = hours % 12 || 12;
    return `${hr}:${minutes}${ampm}`;
};

const handleDatesSet = (arg) => {
    localStorage.setItem("calendarView", arg.view.type);
    localStorage.setItem("calendarDate", arg.startStr);

    setTimeout(() => {
        const savedScrollTop = localStorage.getItem("calendarScrollTop");
        if (savedScrollTop) {
            const scrollContainer = document.querySelector('.fc-scroller-liquid-absolute');
            if (scrollContainer) {
                scrollContainer.scrollTop = parseInt(savedScrollTop);
            }
        }
    }, 100);
};

const storedView = localStorage.getItem("calendarView") || "timeGridWeek";
const storedDate = localStorage.getItem("calendarDate") || new Date().toISOString();

// const getEventClassNames = (arg) => {
//     const event = arg.event;
//     console.log("Hoii")
//     console.log(event.extendedProps)
//     const classes = [];

//     if (event.extendedProps.Type === 'Accountability') {
//         console.log('hey I am acc')
//         classes.push('accountability-event');
//         classes.push(event.extendedProps.verified ? 'verified' : 'unverified');

//         // NEW: Randomised subtype
//     }
//     if (event.extendedProps.CollectionType === 'RandomisedCollection') {

//         classes.push('randomised-accountability');
//     }

//     return classes;
// };

const getEventClassNames = (arg) => {
    const event = arg.event;
    const classes = [];
    if (event.extendedProps.Type === 'Accountability') {
        classes.push('accountability-event');
        classes.push(event.extendedProps.verified ? 'verified' : 'unverified');
    }
    if (event.extendedProps.CollectionType === 'RandomisedCollection') {
        classes.push('randomised-accountability');
    }
    return classes;
};

const Calendarr = () => {
    const dispatch = useDispatch();
    const allEvents = useSelector((state) => state.calendar.CalendarEvents);
    const deleteMode = useSelector((state) => state.calendar.deleteMode); //  Redux deleteMode
    const { mode } = useSelector((state) => state.copyPaste);

    const calendarRef = useRef();
    const scrollSaveTimeoutRef = useRef(null);

    useEffect(() => {
        const setupScrollListener = () => {
            const scrollContainer = document.querySelector('.fc-scroller-liquid-absolute');
            if (scrollContainer) {
                scrollContainer.addEventListener('scroll', handleScroll);

                const savedScrollTop = localStorage.getItem("calendarScrollTop");
                if (savedScrollTop) {
                    scrollContainer.scrollTop = parseInt(savedScrollTop);
                }

                return () => {
                    scrollContainer.removeEventListener('scroll', handleScroll);
                };
            }
        };

        const timeoutId = setTimeout(setupScrollListener, 200);
        return () => {
            clearTimeout(timeoutId);
            if (scrollSaveTimeoutRef.current) {
                clearTimeout(scrollSaveTimeoutRef.current);
            }
        };
    }, []);
    useEffect(() => {
        const restoreScroll = () => {
            const savedScrollTop = localStorage.getItem("calendarScrollTop");
            if (savedScrollTop) {
                const scrollContainer = document.querySelector('.fc-scroller-liquid-absolute');
                if (scrollContainer) {
                    scrollContainer.scrollTop = parseInt(savedScrollTop);
                }
            }
        };

        const timeoutId = setTimeout(restoreScroll, 100);
        return () => clearTimeout(timeoutId);
    }, [allEvents]);


    const saveScrollPosition = () => {
        const scrollContainer = document.querySelector('.fc-scroller-liquid-absolute');
        if (scrollContainer) {
            localStorage.setItem("calendarScrollTop", scrollContainer.scrollTop.toString());
        }
    };
    const handleScroll = () => {
        if (scrollSaveTimeoutRef.current) {
            clearTimeout(scrollSaveTimeoutRef.current);
        }
        scrollSaveTimeoutRef.current = setTimeout(saveScrollPosition, 150);
    };
    const handleDrop = (info) => {
        const startTime = new Date(info.event.start);
        const startDate = new Date(info.event.start);
        const endTime = new Date(startDate.getTime() + 10 * 60 * 1000);

        const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)} / ${startTime.getDate()}/${startTime.getMonth() + 1}/${startTime.getFullYear()}`;

        const newEvent = {
            Type: info.event.extendedProps.Type,
            SpecificEventId: info.event.extendedProps.SpecificEventId,
            title: info.event.title,
            start: startDate.toISOString(),
            end: endTime.toISOString(),
            timeSlot: timeSlot,
            CollectionType: info.event.extendedProps.CollectionType,
            fromDb: false,
        };

        if (info.event.extendedProps.Type === "Todo") {
            newEvent.TodoId = info.event.id;
        } else if (info.event.extendedProps.Type === "Accountability") {
            newEvent.AccountabilityId = info.event.id;
            newEvent.verified = false;
        }

        const eventsBefore = store.getState().calendar.CalendarEvents.length;
        dispatch(addEventsToRedux(newEvent));

        setTimeout(() => {
            const eventsAfter = store.getState().calendar.CalendarEvents.length;
            if (eventsAfter === eventsBefore) {
                info.revert();
                console.log(" Collision — event not added");
            } else {
                console.log(" Event successfully added");
            }
        }, 0);
    };
    const handleChange = (info) => {
        const startTime = new Date(info.event.start);
        const endTime = new Date(info.event.end);

        const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)} / ${startTime.getDate()}/${startTime.getMonth() + 1}/${startTime.getFullYear()}`;

        const updatedEvent = {
            Type: info.event.extendedProps.Type,
            SpecificEventId: info.event.extendedProps.SpecificEventId,
            TodoId: info.event.extendedProps.TodoId,
            AccountabilityId: info.event.extendedProps.AccountabilityId,
            title: info.event.title,
            start: info.event.start.toISOString(),
            end: info.event.end.toISOString(),
            timeSlot,
            CollectionType: info.event.extendedProps.CollectionType,
            verified: info.event.extendedProps.verified || false,
        };

        dispatch(updateEventInRedux(updatedEvent));
    };
    const handleEventClick = (arg) => {
        const event = arg.event;
        const { StrictMode, SpecificEventId } = event.extendedProps;

        if (mode === 'copy') {
            const payload = {
                ...event.extendedProps,
                title: event.title,
                start: event.start.toISOString(),
                end: event.end.toISOString(),
            };

            dispatch(addToCopyBuffer(payload)); // ✅ Toggle buffer
            return;
        }

        // --------- STRICT MODE LOGIC BELOW (Delete only) ---------
        if (!deleteMode) return;

        if (StrictMode) {
            const now = new Date();
            const strictTime = new Date(StrictMode);

            if (strictTime > now) {
                const formattedTime = strictTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });

                const formattedDate = strictTime.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                });

                alert(`This event is locked until ${formattedTime} on ${formattedDate}.`);
                return;
            }
        }

        dispatch(deleteEventFromRedux({ SpecificEventId }));
    };
    const handlePaste = (arg) => {
        if (mode !== 'paste') return;

        const { date } = arg;
        const copied = store.getState().copyPaste.copiedEvents;

        if (!copied.length) return;

        // Reference start: first copied event
        const baseStart = new Date(copied[0].start);

        const newEvents = copied.map(original => {
            const originalStart = new Date(original.start);
            const originalEnd = new Date(original.end);

            const offsetMs = originalStart - baseStart; // Time difference from first copied

            const newStart = new Date(date.getTime() + offsetMs);
            const newEnd = new Date(newStart.getTime() + (originalEnd - originalStart)); // Preserve duration

            const timeSlot = `${formatTime(newStart)} - ${formatTime(newEnd)} / ${newStart.getDate()}/${newStart.getMonth() + 1}/${newStart.getFullYear()}`;

            const {
                _id,
                StrictMode,
                SpecificEventId,
                ...rest
            } = original;

            return {
                ...rest,
                SpecificEventId: uuidv4(),
                start: newStart.toISOString(),
                end: newEnd.toISOString(),
                timeSlot,
                verified: false,
                fromDb: false,
            };
        });

        newEvents.forEach(e => dispatch(addEventsToRedux(e)));
    };

    return (
        <div className="w-full">
            {/*  Delete toggle removed because it's now global in CalendarControls */}

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                slotDuration="00:05:00"
                slotLabelInterval="01:00"
                allDaySlot={false}
                expandRows={true}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                eventOverlap={true}
                initialView={storedView}
                initialDate={storedDate}
                datesSet={handleDatesSet}
                eventClassNames={getEventClassNames}
                events={allEvents}
                eventReceive={handleDrop}
                eventDrop={handleChange}
                eventResize={handleChange}
                eventResizableFromStart={true}
                eventDurationEditable={true}
                eventClick={handleEventClick}
                dateClick={handlePaste}



            />
        </div>
    );
};

export default Calendarr;
