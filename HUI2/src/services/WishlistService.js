import axios from "axios";

const API = "http://localhost:8082/wishlist";

export const getWishlist = (email) => axios.get(`${API}/${email}`);

export const addToWishlist = (item) => axios.post(API, item);

export const removeFromWishlist = (pid, email) =>
    axios.delete(`${API}/${pid}/${email}`);

export const checkWishlist = (pid, email) =>
    axios.get(`${API}/check/${pid}/${email}`);
