import axios from "axios";

const API_URL = "http://localhost:8082/orders";

export const placeOrder = (order) => {
    return axios.post(API_URL, order);
};

export const getOrders = (email) => {
    return axios.get(`${API_URL}/${email}`);
};

export const getAllOrders = () => {
    return axios.get(`${API_URL}/all`);
};

export const updateOrderStatus = (id, status) => {
    return axios.put(`${API_URL}/${id}/status`, { status });
};