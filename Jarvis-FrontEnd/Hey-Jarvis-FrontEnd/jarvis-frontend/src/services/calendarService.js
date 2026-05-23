// src/services/calendarService.js

import axiosInstance from "./axiosInstance"; //import your configured axios instance

export const saveAllCalendarData = async (payload) => {
  try {
    const res = await axiosInstance.post("/SaveAll", payload);
    return res.data; //  successful response
  } catch (err) {
    console.error(" saveAllCalendarData failed:", err);
    throw err; //  propagate to UI
  }
};

export const getUpcomingTodoEvents = async (photoId, limit = 3, skip = 0) => {
  const res = await axiosInstance.get(`/calendar/next-todo-events/${photoId}?limit=${limit}&skip=${skip}`);
  return res.data;
};


export const getAccountabilitiesInCollisionWithTodo = async ({ TodoId, SpecificEventId }) => {
  try {
    const res = await axiosInstance.post("/GetTodoCollision", {
      TodoId,
      SpecificEventId
    });
    return res.data.OtherAccountabilitiesInCollisionWith || [];
  } catch (err) {
    console.error("getAccountabilitiesInCollisionWithTodo failed:", err);
    throw new Error("Failed to fetch accountability collisions");
  }
};


