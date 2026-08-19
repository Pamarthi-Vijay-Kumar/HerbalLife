import axios from "axios";

const API = "http://localhost:8082/users";

export const getAllUsers = () => axios.get(`${API}/all`);

export const updateUserRole = (id, role) =>
    axios.put(`${API}/${id}/role`, { role });

export const toggleUserBlock = (id, blocked) =>
    axios.put(`${API}/${id}/block`, { blocked });

export const deleteUser = (id) => axios.delete(`${API}/${id}`);
