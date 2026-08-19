import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/WishlistService";

function Wishlist() {

    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadWishlist();

    }, []);

    const loadWishlist = async () => {

        const email = localStorage.getItem("email");

        if (!email) {

            setLoading(false);

            return;

        }

        try {

            const response = await getWishlist(email);

            setItems(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRemove = async (pid) => {

        const email = localStorage.getItem("email");

        await removeFromWishlist(pid, email);

        setItems(items.filter(item => item.pid !== pid));

    };

    if (!localStorage.getItem("email")) {

        return (
            <div className="max-w-7xl mx-auto p-10">

                <h1 className="text-4xl font-bold text-green-700 mb-6">
                    My Wishlist
                </h1>

                <p className="text-gray-600">
                    Please{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-green-700 underline"
                    >
                        login
                    </button>
                    {" "}to view your wishlist.
                </p>

            </div>
        );

    }

    return (

        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                My Wishlist
            </h1>

            {loading ? (

                <p>Loading...</p>

            ) : items.length === 0 ? (

                <p className="text-gray-600">
                    Your wishlist is empty.
                </p>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {items.map(item => (

                        <div
                            key={item.id}
                            className="shadow-lg rounded-xl p-5"
                        >

                            <img
                                src={item.image}
                                alt={item.pname}
                                className="w-full h-60 object-cover rounded-lg"
                            />

                            <h2 className="text-2xl font-semibold mt-4">
                                {item.pname}
                            </h2>

                            <p className="text-green-700 font-bold mt-2">
                                ₹ {item.price}
                            </p>

                            <div className="flex gap-3 mt-5">

                                <button
                                    onClick={() => navigate(`/products/${item.pid}`)}
                                    className="bg-green-600 text-white px-5 py-2 rounded-lg flex-1 hover:bg-green-700"
                                >
                                    View
                                </button>

                                <button
                                    onClick={() => handleRemove(item.pid)}
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Wishlist;
