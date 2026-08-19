import axios from "axios";

const API = "http://localhost:8082/cart";

export const getCart = (email) => axios.get(`${API}/${email}`);

export const addToCart = (product) => axios.post(API, product);

export const deleteCart = (id) => axios.delete(`${API}/${id}`);

export const updateCartQuantity = (id, quantity) => axios.put(`${API}/${id}`, { quantity });