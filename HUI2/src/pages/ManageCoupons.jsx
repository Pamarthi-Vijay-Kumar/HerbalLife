import { useEffect, useState } from "react";
import {
    getAllCoupons,
    addCoupon,
    deleteCoupon,
    toggleCouponActive
} from "../services/CouponService";

function ManageCoupons() {

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        code: "",
        discountPercent: "",
        minOrderAmount: ""
    });

    useEffect(() => {

        loadCoupons();

    }, []);

    const loadCoupons = async () => {

        try {

            const response = await getAllCoupons();

            setCoupons(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleAdd = async (e) => {

        e.preventDefault();

        try {

            await addCoupon({
                code: form.code,
                discountPercent: Number(form.discountPercent),
                minOrderAmount: Number(form.minOrderAmount) || 0
            });

            setForm({ code: "", discountPercent: "", minOrderAmount: "" });

            loadCoupons();

        } catch (error) {

            alert(error.response?.data || "Failed To Add Coupon");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this coupon?")) {
            return;
        }

        await deleteCoupon(id);

        loadCoupons();

    };

    const handleToggle = async (coupon) => {

        await toggleCouponActive(coupon.id, !coupon.active);

        loadCoupons();

    };

    return (

        <div className="max-w-5xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Manage Coupons
            </h1>

            <form
                onSubmit={handleAdd}
                className="bg-white shadow-lg rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >

                <div>
                    <label className="block text-sm text-gray-500 mb-1">Code</label>
                    <input
                        type="text"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="SAVE20"
                        className="w-full border rounded-lg p-3 uppercase"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-500 mb-1">Discount %</label>
                    <input
                        type="number"
                        name="discountPercent"
                        value={form.discountPercent}
                        onChange={handleChange}
                        placeholder="20"
                        min="1"
                        max="100"
                        className="w-full border rounded-lg p-3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-500 mb-1">Min Order (₹)</label>
                    <input
                        type="number"
                        name="minOrderAmount"
                        value={form.minOrderAmount}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                    Add Coupon
                </button>

            </form>

            {loading ? (

                <p>Loading coupons...</p>

            ) : coupons.length === 0 ? (

                <p className="text-gray-600">No coupons created yet.</p>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">

                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="p-4 text-left">Code</th>
                                <th className="p-4 text-left">Discount</th>
                                <th className="p-4 text-left">Min Order</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {coupons.map(coupon => (

                                <tr key={coupon.id} className="border-b">

                                    <td className="p-4 font-mono font-bold">{coupon.code}</td>

                                    <td className="p-4">{coupon.discountPercent}%</td>

                                    <td className="p-4">
                                        {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : "None"}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={
                                                "px-3 py-1 rounded-full text-xs font-semibold " +
                                                (coupon.active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600")
                                            }
                                        >
                                            {coupon.active ? "Active" : "Disabled"}
                                        </span>

                                    </td>

                                    <td className="p-4 flex gap-3">

                                        <button
                                            onClick={() => handleToggle(coupon)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            {coupon.active ? "Disable" : "Enable"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default ManageCoupons;
