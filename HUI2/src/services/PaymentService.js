import axios from "axios";

const API = "http://localhost:8082/payment";

export const createRazorpayOrder = (amount) =>
    axios.post(`${API}/create-order`, { amount });

export const verifyPayment = (paymentData) =>
    axios.post(`${API}/verify`, paymentData);
