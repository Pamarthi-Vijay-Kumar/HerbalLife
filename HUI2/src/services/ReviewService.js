import axios from "axios";

const API = "http://localhost:8082/reviews";

export const getReviews = (pid) => axios.get(`${API}/${pid}`);

export const addReview = (review) => axios.post(API, review);
