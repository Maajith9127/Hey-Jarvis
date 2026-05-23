// src/services/getAllDataFromServer.js
import axiosInstance from './axiosInstance';

export const getAllDataFromServer = async () => {
  try {
    const res = await axiosInstance.get('/GetAll');
    return res.data; // { Accountability, Calendar, LivePhotos }
  } catch (err) {
    console.error("Failed to fetch all data:", err);
    throw err;
  }
};
