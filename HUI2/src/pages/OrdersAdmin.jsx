import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../services/OrderService";

const STATUS_OPTIONS = ["Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

function OrdersAdmin() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            const response = await getAllOrders();

            setOrders(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleStatusChange = async (id, status) => {

        try {

            await updateOrderStatus(id, status);

            setOrders(orders.map(order =>
                order.id === id ? { ...order, status } : order
            ));

        } catch (error) {

            console.log(error);

            alert("Failed To Update Order Status");

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-10">

                <h1 className="text-4xl font-bold text-green-700 mb-10">
                    All Orders
                </h1>

                {loading ? (

                    <p>Loading orders...</p>

                ) : orders.length === 0 ? (

                    <p className="text-gray-600">No Orders Found</p>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">

                            <thead className="bg-gray-900 text-white">

                                <tr>
                                    <th className="p-4 text-left">Product</th>
                                    <th className="p-4 text-left">Customer</th>
                                    <th className="p-4 text-left">Contact</th>
                                    <th className="p-4 text-left">Address</th>
                                    <th className="p-4 text-left">Qty</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {orders.map(order => (

                                    <tr key={order.id} className="border-b">

                                        <td className="p-4 flex items-center gap-3">

                                            <img
                                                src={order.image}
                                                alt={order.pname}
                                                className="w-12 h-12 rounded object-cover"
                                            />

                                            {order.pname}

                                        </td>

                                        <td className="p-4">
                                            {order.fullname}
                                            <div className="text-sm text-gray-500">
                                                {order.email}
                                            </div>
                                        </td>

                                        <td className="p-4">{order.mobile}</td>

                                        <td className="p-4 max-w-xs">{order.address}</td>

                                        <td className="p-4">{order.quantity}</td>

                                        <td className="p-4">₹ {order.totalPrice}</td>

                                        <td className="p-4">

                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="border rounded-lg p-2"
                                            >

                                                {STATUS_OPTIONS.map(status => (

                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>

                                                ))}

                                            </select>

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

export default OrdersAdmin;
