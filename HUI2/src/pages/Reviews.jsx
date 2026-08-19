import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/ProductService";
import { getReviews } from "../services/ReviewService";

function Reviews() {

    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAllReviews();

    }, []);

    const loadAllReviews = async () => {

        try {

            const productsResponse = await getProducts();
            const products = productsResponse.data;

            const reviewPromises = products.map(product =>
                getReviews(product.pid).then(response => ({
                    product,
                    reviews: response.data.reviews
                }))
            );

            const results = await Promise.all(reviewPromises);

            const combined = results.flatMap(({ product, reviews }) =>
                reviews.map(review => ({ ...review, product }))
            );

            combined.sort((a, b) => (a.date < b.date ? 1 : -1));

            setAllReviews(combined);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="max-w-6xl mx-auto p-10">

            <h1 className="text-5xl font-bold text-green-700">
                Customer Reviews
            </h1>

            {loading ? (

                <p className="mt-8">Loading reviews...</p>

            ) : allReviews.length === 0 ? (

                <p className="mt-8 text-gray-600">
                    No reviews yet. Be the first to review a product!
                </p>

            ) : (

                <div className="mt-10 space-y-6">

                    {allReviews.map(review => (

                        <div
                            key={review.id}
                            className="bg-white shadow-lg rounded-xl p-6"
                        >

                            <div className="flex justify-between items-center">

                                <Link
                                    to={`/products/${review.product.pid}`}
                                    className="font-bold text-lg text-green-700 hover:underline"
                                >
                                    {review.product.pname}
                                </Link>

                                <span className="text-yellow-500 font-semibold">
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </span>

                            </div>

                            <p className="text-gray-500 text-sm mt-1">
                                {review.name} &middot; {review.date}
                            </p>

                            <p className="text-gray-700 mt-3">
                                {review.comment}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    )
}

export default Reviews;
