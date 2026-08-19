import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../services/OrderService";
import { createRazorpayOrder, verifyPayment } from "../services/PaymentService";
import { validateCoupon } from "../services/CouponService";
import axios from "axios";

function Checkout() {

    const navigate = useNavigate();
    const location = useLocation();

    // Cart checkout
    const cart = location.state?.cart || [];

    // Buy Now checkout
    const buyNow = location.state?.buyNow || false;
    const buyNowProduct = location.state?.product || null;

    // Decide which products should be ordered
    const orderItems = buyNow && buyNowProduct
        ? [buyNowProduct]
        : cart;

    const [customer, setCustomer] = useState({
        fullname: "",
        mobile: "",
        address: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [placing, setPlacing] = useState(false);

    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const handleChange = (e) => {

        setCustomer({
            ...customer,
            [e.target.name]: e.target.value
        });

    };

    const grandTotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const payableTotal = grandTotal - discountAmount;

    const handleApplyCoupon = async () => {

        if (!couponInput.trim()) {
            return;
        }

        setApplyingCoupon(true);
        setCouponError("");

        try {

            const response = await validateCoupon(couponInput.trim(), grandTotal);

            setAppliedCoupon(response.data);

        } catch (error) {

            setAppliedCoupon(null);

            setCouponError(error.response?.data || "Invalid coupon code");

        } finally {

            setApplyingCoupon(false);

        }

    };

    const removeCoupon = () => {

        setAppliedCoupon(null);
        setCouponInput("");
        setCouponError("");

    };

    // Saves one Order document per item, all tagged with the same payment info.
    // The coupon discount is distributed across items proportionally so each
    // order's totalPrice reflects what was actually charged for that item.
    const saveOrders = async (paymentInfo) => {

        const email = localStorage.getItem("email");

        for (const item of orderItems) {

            const itemSubtotal = item.price * item.quantity;

            const itemShare = grandTotal > 0 ? itemSubtotal / grandTotal : 0;

            const itemDiscount = Math.round(discountAmount * itemShare);

            await placeOrder({

                email,

                fullname: customer.fullname,
                mobile: customer.mobile,
                address: customer.address,

                pid: item.pid,
                pname: item.pname,
                image: item.image,

                price: item.price,
                quantity: item.quantity,
                totalPrice: itemSubtotal - itemDiscount,

                status: "Placed",

                paymentId: paymentInfo.paymentId || "",
                razorpayOrderId: paymentInfo.razorpayOrderId || "",
                paymentStatus: paymentInfo.paymentStatus,
                paymentMode: paymentInfo.paymentMode,

                couponCode: appliedCoupon ? appliedCoupon.code : "",
                discountAmount: itemDiscount

            });

            // Delete from cart only when order came from cart
            if (!buyNow && item.id) {

                await axios.delete(
                    `http://localhost:8082/cart/${item.id}`
                );

            }

        }

    };

    const handlePlaceOrder = async () => {

        const email = localStorage.getItem("email");

        if (!email) {

            alert("Please Login First");

            navigate("/login");

            return;
        }

        if (orderItems.length === 0) {

            alert("No products available for checkout");

            navigate("/products");

            return;
        }

        if (!customer.fullname || !customer.mobile || !customer.address) {

            alert("Please Fill In All Delivery Details");

            return;

        }

        setPlacing(true);

        try {

            if (paymentMethod === "cod") {

                await saveOrders({
                    paymentStatus: "Pending",
                    paymentMode: "Cash on Delivery"
                });

                alert("Order Placed Successfully (Cash on Delivery)");

                navigate("/orders");

                return;

            }

            // Razorpay flow
            const orderResponse = await createRazorpayOrder(payableTotal);
            const { orderId, amount, currency, keyId } = orderResponse.data;

            const options = {

                key: keyId,
                amount: amount,
                currency: currency,
                name: "HerbalLife",
                description: "Order Payment",
                order_id: orderId,

                handler: async function (response) {

                    try {

                        const verifyResponse = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (!verifyResponse.data.valid) {

                            alert("Payment Verification Failed. Please Contact Support.");

                            setPlacing(false);

                            return;

                        }

                        await saveOrders({
                            paymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            paymentStatus: "Paid",
                            paymentMode: "Razorpay"
                        });

                        alert("Payment Successful! Order Placed.");

                        navigate("/orders");

                    } catch (error) {

                        console.log(error);

                        const backendMessage = error.response?.data;

                        alert(
                            (backendMessage || "Order saving failed after payment.") +
                            "\n\nYour payment ID (for support): " + response.razorpay_payment_id
                        );

                    } finally {

                        setPlacing(false);

                    }

                },

                modal: {
                    ondismiss: function () {
                        setPlacing(false);
                    }
                },

                prefill: {
                    name: customer.fullname,
                    email: email,
                    contact: customer.mobile
                },

                theme: {
                    color: "#15803d"
                }

            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function () {
                alert("Payment Failed. Please Try Again.");
                setPlacing(false);
            });

            razorpay.open();

        } catch (error) {

            console.log(error);

            const backendMessage = error.response?.data;

            alert(
                "Failed To Start Payment.\n\n" +
                (backendMessage
                    ? "Reason: " + backendMessage
                    : "Check that the backend is running and reachable at localhost:8082.")
            );

            setPlacing(false);

        }

    };

    return (

        <div className="max-w-4xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-8">
                Checkout
            </h1>

            {/* Customer Details */}

            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">
                    Delivery Details
                </h2>

                <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={customer.fullname}
                    className="border p-3 rounded-lg w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={customer.mobile}
                    className="border p-3 rounded-lg w-full mb-4"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="address"
                    placeholder="Delivery Address"
                    value={customer.address}
                    className="border p-3 rounded-lg w-full mb-6"
                    rows="4"
                    onChange={handleChange}
                    required
                />

            </div>

            {/* Payment Method */}

            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">
                    Payment Method
                </h2>

                <label className="flex items-center gap-3 mb-3 cursor-pointer">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />

                    Pay Online (Card / UPI / Netbanking via Razorpay)

                </label>

                <label className="flex items-center gap-3 cursor-pointer">

                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />

                    Cash On Delivery

                </label>

            </div>

            {/* Coupon */}

            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">
                    Have A Coupon?
                </h2>

                {appliedCoupon ? (

                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">

                        <div>
                            <p className="font-bold text-green-700">
                                {appliedCoupon.code} Applied
                            </p>
                            <p className="text-sm text-gray-600">
                                {appliedCoupon.discountPercent}% off — you saved ₹{appliedCoupon.discountAmount}
                            </p>
                        </div>

                        <button
                            onClick={removeCoupon}
                            className="text-red-600 font-semibold hover:underline"
                        >
                            Remove
                        </button>

                    </div>

                ) : (

                    <div>

                        <div className="flex gap-3">

                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="border p-3 rounded-lg flex-1 uppercase"
                            />

                            <button
                                onClick={handleApplyCoupon}
                                disabled={applyingCoupon}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                            >
                                {applyingCoupon ? "Checking..." : "Apply"}
                            </button>

                        </div>

                        {couponError && (
                            <p className="text-red-600 text-sm mt-2">{couponError}</p>
                        )}

                    </div>

                )}

            </div>

            {/* Order Summary */}

            <div className="bg-white shadow-lg rounded-xl p-6">

                <h2 className="text-2xl font-bold mb-5">
                    Order Summary
                </h2>

                {orderItems.map((item, index) => (

                    <div
                        key={item.id || item.pid || index}
                        className="flex items-center justify-between border-b py-4"
                    >

                        <div className="flex items-center gap-4">

                            <img
                                src={item.image}
                                alt={item.pname}
                                className="w-20 h-20 object-cover rounded-lg"
                            />

                            <div>

                                <h3 className="font-bold">
                                    {item.pname}
                                </h3>

                                <p>
                                    ₹ {item.price}
                                </p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                            </div>

                        </div>

                        <p className="font-bold">
                            ₹ {item.price * item.quantity}
                        </p>

                    </div>

                ))}

                <div className="text-right mt-6">

                    <p className="text-gray-600">
                        Subtotal : ₹ {grandTotal}
                    </p>

                    {discountAmount > 0 && (

                        <p className="text-green-700">
                            Coupon Discount : − ₹ {discountAmount}
                        </p>

                    )}

                    <h2 className="text-2xl font-bold mt-2">
                        Grand Total : ₹ {payableTotal}
                    </h2>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placing}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg mt-5 hover:bg-green-700 disabled:opacity-50"
                    >
                        {placing
                            ? "Processing..."
                            : paymentMethod === "cod"
                                ? "Place Order"
                                : `Pay ₹ ${payableTotal}`}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Checkout;