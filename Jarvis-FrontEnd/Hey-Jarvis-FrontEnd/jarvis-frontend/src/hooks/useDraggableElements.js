// import { useEffect } from 'react';
// import { Draggable } from '@fullcalendar/interaction';
// import { v4 as uuidv4 } from 'uuid';

// const useDraggableElements = () => {
//     //  For Todos
//     useEffect(() => {
//         const TODO_DRAGGABLES = document.querySelector(".Todo-Draggable-Elements");

//         const observer = new MutationObserver(() => {
//             new Draggable(TODO_DRAGGABLES, {
//                 itemSelector: ".ScrollBar_Elements",
//                 eventData: (element) => {
//                     const collectionType = element.getAttribute("data-collectiontype");
//                     console.log(collectionType)
//                     const todoId = element.getAttribute("data-id");

//                     return {
//                         id: todoId,
//                         title: element.innerText || "Untitled",
//                         extendedProps: {
//                             Type: "Todo",
//                             TodoId: todoId,
//                             SpecificEventId: uuidv4(),
//                             CollectionType: collectionType,
//                         },
//                     };
//                 },
//             });
//         });

//         if (TODO_DRAGGABLES) {
//             observer.observe(TODO_DRAGGABLES, { childList: true, subtree: true });
//         }

//         return () => observer.disconnect();
//     }, []);

//     //  For Accountabilities
//     useEffect(() => {
//         const ACCOUNTABILITY_DRAGGABLES = document.querySelector(".Accountability-Draggable-Elements");

//         const observer = new MutationObserver(() => {
//             new Draggable(ACCOUNTABILITY_DRAGGABLES, {
//                 itemSelector: ".ScrollBar_Elements",
//                 eventData: (element) => {
//                     const collectionType = element.getAttribute("data-collectiontype");
//                     const AccountabilityId = element.getAttribute("data-id");

//                     return {
//                         id: AccountabilityId,
//                         title: element.innerText || "Untitled",
//                         extendedProps: {
//                             Type: "Accountability",
//                             AccountabilityId: AccountabilityId,
//                             SpecificEventId: uuidv4(),
//                             CollectionType: collectionType,
//                         },
//                     };
//                 },
//             });
//         });

//         if (ACCOUNTABILITY_DRAGGABLES) {
//             observer.observe(ACCOUNTABILITY_DRAGGABLES, { childList: true, subtree: true });
//         }

//         return () => observer.disconnect();
//     }, []);
// };

// export default useDraggableElements;






import { useEffect } from 'react';
import { Draggable } from '@fullcalendar/interaction';
import { v4 as uuidv4 } from 'uuid';

const useDraggableElements = () => {
    useEffect(() => {
        const TODO_DRAGGABLES = document.querySelector(".Todo-Draggable-Elements");
        if (!TODO_DRAGGABLES) return;

        const todoDraggable = new Draggable(TODO_DRAGGABLES, {
            itemSelector: ".ScrollBar_Elements",
            eventData: (element) => {
                const collectionType = element.getAttribute("data-collectiontype");
                const todoId = element.getAttribute("data-id");

                return {
                    id: todoId,
                    title: element.innerText || "Untitled",
                    extendedProps: {
                        Type: "Todo",
                        TodoId: todoId,
                        SpecificEventId: uuidv4(),
                        CollectionType: collectionType,
                    },
                };
            },
        });

        return () => {
            // Manual cleanup if needed
            TODO_DRAGGABLES.innerHTML = '';
        };
    }, []);

    useEffect(() => {
        const ACCOUNTABILITY_DRAGGABLES = document.querySelector(".Accountability-Draggable-Elements");
        if (!ACCOUNTABILITY_DRAGGABLES) return;

        const accountabilityDraggable = new Draggable(ACCOUNTABILITY_DRAGGABLES, {
            itemSelector: ".ScrollBar_Elements",
            eventData: (element) => {
                const collectionType = element.getAttribute("data-collectiontype");
                const AccountabilityId = element.getAttribute("data-id");

                return {
                    id: AccountabilityId,
                    title: element.innerText || "Untitled",
                    extendedProps: {
                        Type: "Accountability",
                        AccountabilityId: AccountabilityId,
                        SpecificEventId: uuidv4(),
                        CollectionType: collectionType,
                    },
                };
            },
        });

        return () => {
            // Manual cleanup if needed
            ACCOUNTABILITY_DRAGGABLES.innerHTML = '';
        };
    }, []);
};

export default useDraggableElements;
