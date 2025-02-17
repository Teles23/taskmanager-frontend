import api from "./api";

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("users", userData);
};
export const getUserById = async (userId: number) => {
  return api.get(`users/${userId}`);
};
