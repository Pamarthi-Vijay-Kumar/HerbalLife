import axios from "axios";

const API = "http://localhost:8082/products";

export const getProducts = () => axios.get(API);

export const getRelatedProducts = (pid) => axios.get(`${API}/related/${pid}`);