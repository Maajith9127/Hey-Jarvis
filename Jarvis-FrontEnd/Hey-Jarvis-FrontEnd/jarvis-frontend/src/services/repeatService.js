// src/services/repeatService.js
import axiosInstance from './axiosInstance';

export const generateRepeatedEvents = async (data) => {
    const res = await axiosInstance.post("/apiGenerateEvents/generate-events", data);
    return res.data;
};
