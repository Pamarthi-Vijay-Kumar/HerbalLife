import axios from "axios";

const API = "http://localhost:8082/profile";

export const getProfile = (email) => axios.get(`${API}/${email}`);

export const updateProfile = (email, data) => axios.put(`${API}/${email}`, data);

export const changePassword = (email, data) =>
    axios.put(`${API}/${email}/password`, data);
