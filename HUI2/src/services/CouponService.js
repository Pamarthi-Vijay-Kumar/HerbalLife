import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/coupons`;
export const validateCoupon = (code, amount) =>
    axios.post(`${API}/validate`, { code, amount });

export const getAllCoupons = () => axios.get(`${API}/all`);

export const addCoupon = (coupon) => axios.post(API, coupon);

export const deleteCoupon = (id) => axios.delete(`${API}/${id}`);

export const toggleCouponActive = (id, active) =>
    axios.put(`${API}/${id}/active`, { active });
