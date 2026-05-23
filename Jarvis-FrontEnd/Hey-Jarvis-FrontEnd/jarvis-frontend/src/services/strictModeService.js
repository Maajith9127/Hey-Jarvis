//  services/strictModeService.js
import axios from './axiosInstance'; // or from '../utils/axiosInstance' if that's your structure

export const activateStrictMode = async (timestamp) => {
  const response = await axios.patch('/SetStrictMode', {
    StrictMode: timestamp, // make sure you pass number (Date.now()) from frontend
  });
  return response.data;
};
