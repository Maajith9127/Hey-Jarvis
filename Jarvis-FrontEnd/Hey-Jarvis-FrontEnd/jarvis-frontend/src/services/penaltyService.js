import axiosInstance from "./axiosInstance";

// Get all penalties
export const getUserPenalties = async () => {
  const res = await axiosInstance.get("/captcha/penalties");
  return res.data.penalties;
};

// Request captcha for a specific penalty
export const getCaptcha = async (accountabilityId, specificEventId) => {
  const res = await axiosInstance.get(`/captcha/${accountabilityId}/${specificEventId}`);
  return res.data; // { captcha, AccountabilityId, SpecificEventId }
};

// Verify captcha
export const verifyCaptcha = async (accountabilityId, specificEventId, answer) => {
  const res = await axiosInstance.post(
    `/captcha/${accountabilityId}/${specificEventId}/verify`,
    { answer }
  );
  return res.data; // { success, solvedCount }
};
