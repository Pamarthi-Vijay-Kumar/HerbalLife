import { useEffect, useState } from "react";
import { getCart, deleteCart, updateCartQuantity } from "../services/CartService";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {

    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

    const email = localStorage.getItem("email");

    const response = await getCart(email);

    setCart(response.data);

};

    const removeItem = async (id) => {
        await deleteCart(id);
        loadCart();
    };

    const changeQuantity = async (item, delta) => {

        const newQuantity = item.quantity + delta;

        if (newQuantity < 1) {
            removeItem(item.id);
            return;
        }

        // Update instantly in the UI, then persist
        setCart(cart.map(c =>
            c.id === item.id ? { ...c, quantity: newQuantity } : c
        ));

        try {

            await updateCartQuantity(item.id, newQuantity);

        } catch (error) {

            console.log(error);

            loadCart();

        }

    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Shopping Cart
            </h1>

            {cart.length === 0 ? (
                <h2 className="text-xl text-gray-600">
                    Your cart is empty.
                </h2>
            ) : (
                <>
                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between shadow-lg rounded-xl p-5 mb-5"
                        >
                            <div className="flex items-center gap-5">

                                <img
                                    src={item.image}
                                    alt={item.pname}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {item.pname}
                                    </h2>

                                    <p>₹ {item.price}</p>

                                    <div className="flex items-center gap-3 mt-1">

                                        <span>Quantity :</span>

                                        <button
                                            onClick={() => changeQuantity(item, -1)}
                                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg font-bold"
                                        >
                                            −
                                        </button>

                                        <span className="w-6 text-center">{item.quantity}</span>

                                        <button
                                            onClick={() => changeQuantity(item, 1)}
                                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg font-bold"
                                        >
                                            +
                                        </button>

                                    </div>

                                    <p className="font-bold">
                                        Total : ₹ {item.price * item.quantity}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="text-right mt-10">

                        <h2 className="text-3xl font-bold">
                            Grand Total : ₹ {total}
                        </h2>

                        <button
                            onClick={() =>
                                navigate("/checkout", {
                                    state: { cart }
                                })
                            }
                            className="bg-green-600 text-white px-8 py-3 rounded-lg mt-5 hover:bg-green-700"
                        >
                            Proceed To Checkout
                        </button>

                    </div>
                </>
            )}

        </div>
    );
}

export default Cart;