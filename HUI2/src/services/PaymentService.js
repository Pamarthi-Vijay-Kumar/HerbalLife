import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/payment`;
export const createRazorpayOrder = (amount) =>
    axios.post(`${API}/create-order`, { amount });

export const verifyPayment = (paymentData) =>
    axios.post(`${API}/verify`, paymentData);
