import { useEffect, useState } from "react";
import { getOrders } from "../services/OrderService";

const STATUS_STEPS = [
    { label: "Placed", icon: "📝" },
    { label: "Shipped", icon: "📦" },
    { label: "Out for Delivery", icon: "🚚" },
    { label: "Delivered", icon: "🏠" }
];

function OrderTimeline({ status }) {

    if (status === "Cancelled") {

        return (

            <div className="flex items-center gap-3 mt-5 bg-red-50 border border-red-200 rounded-xl p-4">

                <span className="text-3xl">❌</span>

                <p className="text-red-700 font-semibold">
                    This order was cancelled.
                </p>

            </div>

        );

    }

    const currentIndex = STATUS_STEPS.findIndex(step => step.label === status);

    return (

        <div className="flex items-start mt-6 px-2">

            {STATUS_STEPS.map((step, index) => {

                const reached = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (

                    <div key={step.label} className="flex items-center flex-1 last:flex-none">

                        <div className="flex flex-col items-center">

                            <div
                                className={
                                    "w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 transition-all " +
                                    (reached
                                        ? "bg-green-600 border-green-200 shadow-lg " + (isCurrent ? "scale-110" : "")
                                        : "bg-gray-100 border-gray-100 grayscale opacity-60")
                                }
                            >
                                {step.icon}
                            </div>

                            <span
                                className={
                                    "text-xs mt-2 text-center w-24 " +
                                    (reached ? "text-green-700 font-bold" : "text-gray-400")
                                }
                            >
                                {step.label}
                            </span>

                        </div>

                        {index < STATUS_STEPS.length - 1 && (

                            <div
                                className={
                                    "flex-1 h-1.5 mx-1 mb-6 rounded-full transition-all " +
                                    (index < currentIndex ? "bg-green-600" : "bg-gray-200")
                                }
                            />

                        )}

                    </div>

                );

            })}

        </div>

    );

}

function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        const email = localStorage.getItem("email");

        const response = await getOrders(email);

        setOrders(response.data);

    };

    return (

        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                My Orders
            </h1>

            {
                orders.length === 0 ?

                <h2 className="text-xl text-gray-600">
                    No Orders Found
                </h2>

                :

                orders.map(order => (

                    <div
                        key={order.id}
                        className="shadow-lg rounded-xl p-5 mb-6"
                    >

                        <div className="flex justify-between items-start flex-wrap gap-5">

                            <div className="flex gap-5">

                                <img
                                    src={order.image}
                                    alt={order.pname}
                                    className="w-32 h-32 rounded-lg object-cover"
                                />

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        {order.pname}
                                    </h2>

                                    <p>Price : ₹ {order.price}</p>

                                    <p>Quantity : {order.quantity}</p>

                                    <p>Total : ₹ {order.totalPrice}</p>

                                    {order.paymentMode && (

                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.paymentMode}
                                            {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                        <OrderTimeline status={order.status} />

                    </div>

                ))
            }

        </div>

    );

}

export default Orders;
