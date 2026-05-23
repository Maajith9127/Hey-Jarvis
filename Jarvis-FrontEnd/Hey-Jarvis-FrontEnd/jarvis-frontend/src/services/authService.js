import axiosInstance from "./axiosInstance";

//  Check if user is logged in
export const checkAuth = async () => {
  const res = await axiosInstance.get("/api/auth/me");
  return res.data;
};

//  Login user
export const loginUser = async (email, password) => {
  const res = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
};
//  Register user
export const registerUser = async (email, password, name) => {
  const res = await axiosInstance.post("/api/auth/register", {
    email,
    password,
    name,
  });
  return res.data;
};
//  Logout user
export const logoutUser = async () => {
  const res = await axiosInstance.post("/api/auth/logout");
  return res.data;
};
