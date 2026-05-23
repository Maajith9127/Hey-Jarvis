// src/services/photoService.js
import axios from './axiosInstance';

//  Save Live Photos (delta-based)
export const saveLivePhotos = async ({ added, updated, deleted }) => {
  return axios.post('/apiPhotos/SaveLivePhotos', { added, updated, deleted });
};
// Fetch all photos
export const fetchLivePhotos = async () => {
  return axios.get('/apiPhotos/GetLivePhotos');
};

// Save positions (changed data only)
export const savePositions = async (positionsPayload) => {
  return axios.post('/apiPositions/SavePositions', positionsPayload);
};

// Fetch positions
export const fetchPositions = async () => {
  try {
    const res = await axios.get('/apiPositions/GetPositions');
    return res.data; //  Only the useful { positions: [...] }
  } catch (err) {
    console.error(" Error fetching positions:", err);
    throw err;
  }
};