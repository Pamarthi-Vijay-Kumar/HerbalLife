import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/profile`;
export const getProfile = (email) => axios.get(`${API}/${email}`);

export const updateProfile = (email, data) => axios.put(`${API}/${email}`, data);

export const changePassword = (email, data) =>
    axios.put(`${API}/${email}/password`, data);
