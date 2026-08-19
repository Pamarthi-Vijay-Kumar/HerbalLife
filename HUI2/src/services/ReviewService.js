import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/reviews`;
export const getReviews = (pid) => axios.get(`${API}/${pid}`);

export const addReview = (review) => axios.post(API, review);
