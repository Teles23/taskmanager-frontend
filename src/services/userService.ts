import api from "./api";

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  console.log(userData);
  return api.post("users", userData);
};
