import axiosInstance from './axiosInstance';

export const fetchMessagesFromServer = async () => {
  const res = await axiosInstance.get("/apiAccountability/GetMessages");
  return res.data.Messages;
};

export const saveMessagesToServer = async ({ added, updated, deleted }) => {
  const res = await axiosInstance.post("/apiAccountability/SaveMessages", {
    added,
    updated,
    deleted,
  });
  return res.data;
};
