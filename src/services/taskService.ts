import api from "./api";

const API_URL = `tasks/user/`; // Ajuste conforme necessário

export const getTasksByUser = async (token: string, userId: number) => {
  return api.get(`${API_URL}${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTasks = async (
  userId: number,
  status?: string,
  sortBy: string = "id",
  order: string = "asc"
) => {
  let url = `${API_URL}${userId}?sortBy=${sortBy}&order=${order}`;
  if (status) {
    url += `&status=${status}`;
  }

  return api.get(url);
};

export const createTask = async (
  userId: number,
  taskData: {
    title: string;
    description: string;
    status: string;
    dueDate: string;
  }
) => {
  return api.post(`${API_URL}${userId}`, taskData);
};

export const updateTask = async (
  userId: number,
  taskId: number,
  taskData: {
    title: string;
    description: string;
    status: string;
    dueDate: string;
  }
) => {
  return api.put(`tasks/${taskId}/user/${userId}`, taskData);
};

export const deleteTask = async (userId: number, taskId: number) => {
  return api.delete(`tasks/${taskId}/user/${userId}`);
};
