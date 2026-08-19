import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ManageProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8082/products"
            );

            setProducts(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const deleteProduct = async (id) => {

        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:8082/products/${id}`
            );

            setProducts(products.filter(p => p.pid !== id));

        } catch (error) {

            alert("Failed To Delete Product");

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-6 md:p-10">

            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">

                <h1 className="text-3xl md:text-4xl font-bold text-green-700">
                    Manage Products
                </h1>

                <Link
                    to="/add-product"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
                >
                    + Add Product
                </Link>

            </div>

            {loading ? (

                <p>Loading products...</p>

            ) : products.length === 0 ? (

                <p className="text-gray-600">No Products Found</p>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">

                        <thead className="bg-gray-900 text-white">

                            <tr>
                                <th className="p-4 text-left">Product</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Price</th>
                                <th className="p-4 text-left">Stock</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map(product => (

                                <tr key={product.pid} className="border-b">

                                    <td className="p-4">

                                        <div className="flex items-center gap-4">

                                            <img
                                                src={product.image}
                                                alt={product.pname}
                                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/100x100?text=No+Image";
                                                }}
                                            />

                                            <div>
                                                <p className="font-semibold">{product.pname}</p>
                                                <p className="text-xs text-gray-400">ID: {product.pid}</p>
                                            </div>

                                        </div>

                                    </td>

                                    <td className="p-4">

                                        {product.category ? (

                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                                {product.category}
                                            </span>

                                        ) : (

                                            <span className="text-gray-400 text-sm">—</span>

                                        )}

                                    </td>

                                    <td className="p-4 font-semibold">₹ {product.pprice}</td>

                                    <td className="p-4">

                                        <span
                                            className={
                                                "px-3 py-1 rounded-full text-xs font-semibold " +
                                                (product.stock > 0
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-red-100 text-red-700")
                                            }
                                        >
                                            {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                        </span>

                                    </td>

                                    <td className="p-4">

                                        <div className="flex gap-3">

                                            <Link
                                                to={`/edit-product/${product.pid}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => deleteProduct(product.pid)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                                            >
                                                Delete
                                            </button>

                                        </div>

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

export default ManageProducts;
