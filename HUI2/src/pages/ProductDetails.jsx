import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../services/CartService";
import { getReviews, addReview } from "../services/ReviewService";
import { addToWishlist, removeFromWishlist, checkWishlist } from "../services/WishlistService";
import { getRelatedProducts } from "../services/ProductService";

function ProductDetails() {

    const { pid } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const [related, setRelated] = useState([]);

    const [inWishlist, setInWishlist] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [average, setAverage] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: ""
    });

    useEffect(() => {

        loadProduct();
        loadReviews();
        checkWishlistStatus();
        loadRelated();

    }, [pid]);

    const loadRelated = async () => {

        try {

            const response = await getRelatedProducts(pid);

            setRelated(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const checkWishlistStatus = async () => {

        const email = localStorage.getItem("email");

        if (!email) {
            return;
        }

        try {

            const response = await checkWishlist(pid, email);

            setInWishlist(response.data.inWishlist);

        } catch (error) {

            console.log(error);

        }

    };

    const toggleWishlist = async () => {

        const email = localStorage.getItem("email");

        if (!email) {

            alert("Please Login First");

            navigate("/login");

            return;

        }

        try {

            if (inWishlist) {

                await removeFromWishlist(pid, email);

                setInWishlist(false);

            } else {

                await addToWishlist({
                    pid: product.pid,
                    pname: product.pname,
                    image: product.image,
                    price: product.pprice,
                    email
                });

                setInWishlist(true);

            }

        } catch (error) {

            console.log(error);

            alert("Failed To Update Wishlist");

        }

    };

    const loadProduct = async () => {

        const response = await axios.get(
            `http://localhost:8082/products/${pid}`
        );

        setProduct(response.data);
        setSelectedImage(response.data.image);

    };

    const loadReviews = async () => {

        const response = await getReviews(pid);

        setReviews(response.data.reviews);
        setAverage(response.data.average);
        setReviewCount(response.data.count);

    };

    const handleReviewChange = (e) => {

        setNewReview({
            ...newReview,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmitReview = async (e) => {

        e.preventDefault();

        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (!isLoggedIn) {

            alert("Please Login First To Leave A Review");

            navigate("/login");

            return;

        }

        try {

            await addReview({

                pid: Number(pid),
                email: localStorage.getItem("email"),
                name: localStorage.getItem("name") || "Anonymous",
                rating: Number(newReview.rating),
                comment: newReview.comment

            });

            setNewReview({ rating: 5, comment: "" });

            loadReviews();

        } catch (error) {

            console.log(error);

            alert("Failed To Submit Review");

        }

    };

    if (!product) {

        return (
            <h2 className="text-center mt-10 text-2xl">
                Loading...
            </h2>
        );

    }
    const handleAddToCart = async () => {

    // Check whether user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {

        alert("Please Login First");

        navigate("/login");

        return;

    }

    if (product.stock <= 0) {

        alert("This product is currently out of stock.");

        return;

    }

    const cartItem = {

        email: localStorage.getItem("email"),

        pid: product.pid,
        pname: product.pname,
        image: product.image,
        price: product.pprice,
        quantity: 1

    };

    try {

        await addToCart(cartItem);

        alert("Product Added To Cart Successfully");

    } catch (error) {

        console.log(error);

        alert("Failed To Add Product");

    }

};


    const handleBuyNow = () => {

    const email = localStorage.getItem("email");

    if (!email) {

        alert("Please Login First");

        navigate("/login");

        return;

    }

    if (product.stock <= 0) {

        alert("This product is currently out of stock.");

        return;

    }

    navigate("/checkout", {
        state: {
            buyNow: true,
            product: {
                pid: product.pid,
                pname: product.pname,
                image: product.image,
                price: product.pprice,
                quantity: 1
            }
        }
    });

};
    return (

        <div className="max-w-7xl mx-auto p-10">

            <div className="grid md:grid-cols-2 gap-10">

                <div>

                    <img
                        src={selectedImage || product.image}
                        alt={product.pname}
                        className="rounded-xl shadow-lg w-full h-[500px] object-cover"
                    />

                    {product.images && product.images.length > 0 && (

                        <div className="flex gap-3 mt-4">

                            <img
                                src={product.image}
                                onClick={() => setSelectedImage(product.image)}
                                className={
                                    "w-20 h-20 rounded-lg object-cover cursor-pointer border-2 " +
                                    (selectedImage === product.image ? "border-green-600" : "border-transparent")
                                }
                            />

                            {product.images.map((img, index) => (

                                <img
                                    key={index}
                                    src={img}
                                    onClick={() => setSelectedImage(img)}
                                    className={
                                        "w-20 h-20 rounded-lg object-cover cursor-pointer border-2 " +
                                        (selectedImage === img ? "border-green-600" : "border-transparent")
                                    }
                                />

                            ))}

                        </div>

                    )}

                </div>

                <div>

                    <h1 className="text-4xl font-bold">
                        {product.pname}
                    </h1>

                    <div className="flex items-center gap-3 mt-3">

                        {product.category && (

                            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                                {product.category}
                            </span>

                        )}

                        <span
                            className={
                                "text-sm font-semibold px-3 py-1 rounded-full " +
                                (product.stock > 0
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700")
                            }
                        >
                            {product.stock > 0
                                ? (product.stock <= 5 ? `Only ${product.stock} left` : "In Stock")
                                : "Out Of Stock"}
                        </span>

                    </div>

                    <p className="text-green-700 text-3xl font-bold mt-5">
                        ₹ {product.pprice}
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        Ingredients
                    </h2>

                    <p className="text-gray-600 mt-2">
                        {product.ping}
                    </p>

                    <h2 className="text-xl font-semibold mt-8">
                        Description
                    </h2>

                    <p className="text-gray-600 mt-2">
                        {product.pdesc}
                    </p>

                    <div className="flex gap-5 mt-10">

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add To Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock <= 0}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy Now
                        </button>

                        <button
                            onClick={toggleWishlist}
                            className={
                                "px-8 py-3 rounded-lg border-2 font-semibold " +
                                (inWishlist
                                    ? "bg-red-50 border-red-500 text-red-600"
                                    : "border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500")
                            }
                        >
                            {inWishlist ? "♥ In Wishlist" : "♡ Add To Wishlist"}
                        </button>

                    </div>

                </div>

            </div>

            {/* Reviews Section */}

            <div className="mt-16 max-w-4xl">

                <h2 className="text-3xl font-bold text-green-700 mb-2">
                    Customer Reviews
                </h2>

                <p className="text-gray-600 mb-8">
                    {reviewCount > 0
                        ? `★ ${average} out of 5 (${reviewCount} review${reviewCount === 1 ? "" : "s"})`
                        : "No reviews yet — be the first to review this product."}
                </p>

                {/* Submit Review Form */}

                <form
                    onSubmit={handleSubmitReview}
                    className="bg-white shadow-lg rounded-xl p-6 mb-10"
                >

                    <h3 className="text-xl font-semibold mb-4">
                        Write A Review
                    </h3>

                    <label className="block mb-2 font-medium">
                        Rating
                    </label>

                    <select
                        name="rating"
                        value={newReview.rating}
                        onChange={handleReviewChange}
                        className="border rounded-lg p-3 mb-4 w-full max-w-xs"
                    >
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★ (4)</option>
                        <option value="3">★★★ (3)</option>
                        <option value="2">★★ (2)</option>
                        <option value="1">★ (1)</option>
                    </select>

                    <textarea
                        name="comment"
                        placeholder="Share your experience with this product..."
                        value={newReview.comment}
                        onChange={handleReviewChange}
                        className="border rounded-lg p-3 w-full mb-4"
                        rows="3"
                        required
                    />

                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Submit Review
                    </button>

                </form>

                {/* Review List */}

                {reviews.length === 0 ? (

                    <p className="text-gray-500">
                        No reviews to show.
                    </p>

                ) : (

                    reviews.map(review => (

                        <div
                            key={review.id}
                            className="border-b py-5"
                        >

                            <div className="flex justify-between items-center">

                                <h4 className="font-bold">
                                    {review.name}
                                </h4>

                                <span className="text-yellow-500 font-semibold">
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </span>

                            </div>

                            <p className="text-gray-500 text-sm">
                                {review.date}
                            </p>

                            <p className="text-gray-700 mt-2">
                                {review.comment}
                            </p>

                        </div>

                    ))

                )}

            </div>

            {/* Related Products */}

            {related.length > 0 && (

                <div className="mt-16">

                    <h2 className="text-3xl font-bold text-green-700 mb-6">
                        You May Also Like
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">

                        {related.map(item => (

                            <div
                                key={item.pid}
                                onClick={() => navigate(`/products/${item.pid}`)}
                                className="bg-white rounded-lg md:rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            >

                                <img
                                    src={item.image}
                                    alt={item.pname}
                                    className="w-full aspect-square object-contain p-3 bg-gray-50"
                                />

                                <div className="p-2.5 md:p-4">

                                    <h3 className="text-xs md:text-base font-medium text-gray-800 line-clamp-2 leading-snug">
                                        {item.pname}
                                    </h3>

                                    <p className="text-green-700 font-bold text-sm md:text-lg mt-1">
                                        ₹{item.pprice}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}

export default ProductDetails;