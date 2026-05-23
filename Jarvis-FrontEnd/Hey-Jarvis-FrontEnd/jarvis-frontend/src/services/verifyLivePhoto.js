import axiosInstance from "./axiosInstance";

export const generateChallenge = async ({ TodoId, collection, Accountability }) => {
    const res = await axiosInstance.post("/apiLivePhotoVerfication/ChallengeGenerate", {
        TodoId,
        collection,
        Accountability
    });
    return res.data;
};

export const uploadVerificationPhoto = async (file) => {
    const formData = new FormData();
    formData.append("VerficationPhoto", file);

    const res = await axiosInstance.post("/api/upload", formData); // Content-Type auto-handled
    return res.data; // expects { Url: "..." }
};

export const verifyLivePhoto = async ({ TodoId, Accountability, enteredString }) => {
    const res = await axiosInstance.post("/apiLivePhotoVerfication", {
        TodoId,
        Accountability,
        enteredString,   //  include it
    });
    return res.data;
};

export const getActiveChallenge = async (TodoId) => {
    const res = await axiosInstance.get(`/apiLivePhotoVerfication/getActiveChallenge?TodoId=${TodoId}`);
    return res.data;
};


