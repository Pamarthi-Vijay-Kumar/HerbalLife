import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/products`;
export const getProducts = () => axios.get(API);

export const getRelatedProducts = (pid) => axios.get(`${API}/related/${pid}`);