import axios from './axiosInstance.js'; // your pre-configured axios with baseURL + interceptors

// CREATE
export const createRandomisedSetting = async (data) => {
    
    console.log(data);
    const res = await axios.post('/randomised/create', data);
    return res.data;
};

// READ
export const fetchAllRandomisedSettings = async () => {
    const res = await axios.get('/randomised/all');
    return res.data;
};

// // UPDATE
// export const updateRandomisedSetting = async (id, updatedData) => {
//     const res = await axios.put(`/randomised/update/${id}`, updatedData);
//     return res.data;
// };

// // DELETE
// export const deleteRandomisedSetting = async (id) => {
//     const res = await axios.delete(`/randomised/delete/${id}`);
//     return res.data;
// };
