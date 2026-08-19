import axios from "axios";

export const getDashboardStats = () =>
axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard-stats`);