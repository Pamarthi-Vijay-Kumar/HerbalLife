import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/ProductService";
import { useNavigate } from "react-router-dom";

function Products() {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [category, setCategory] = useState("all");

    useEffect(() => {

        loadProducts();

    }, []);

    const loadProducts = async () => {

        const response = await getProducts();

        setProducts(response.data);

    };

    const categories = useMemo(() => {

        const unique = new Set(
            products
                .map(product => product.category)
                .filter(cat => cat && cat.trim() !== "")
        );

        return Array.from(unique);

    }, [products]);

    const filteredProducts = useMemo(() => {

        let result = products.filter(product =>
            product.pname.toLowerCase().includes(search.toLowerCase())
        );

        if (category !== "all") {

            result = result.filter(product => product.category === category);

        }

        if (maxPrice) {

            result = result.filter(product => product.pprice <= Number(maxPrice));

        }

        if (sortBy === "price-low") {

            result = [...result].sort((a, b) => a.pprice - b.pprice);

        } else if (sortBy === "price-high") {

            result = [...result].sort((a, b) => b.pprice - a.pprice);

        } else if (sortBy === "name") {

            result = [...result].sort((a, b) => a.pname.localeCompare(b.pname));

        }

        return result;

    }, [products, search, maxPrice, sortBy, category]);

    return (

        <div className="max-w-7xl mx-auto p-4 md:p-10">

            <h1 className="text-2xl md:text-4xl font-bold text-green-700 mb-5 md:mb-8">

                Products

            </h1>

            {/* Search & Filters */}

            <div className="flex flex-wrap gap-3 mb-4">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg p-2.5 md:p-3 flex-1 min-w-[160px] text-sm md:text-base"
                />

                <input
                    type="number"
                    placeholder="Max Price (₹)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border rounded-lg p-2.5 md:p-3 w-32 md:w-40 text-sm md:text-base"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg p-2.5 md:p-3 text-sm md:text-base"
                >
                    <option value="default">Sort By</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                </select>

            </div>

            {/* Category Chips */}

            {categories.length > 0 && (

                <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">

                    <button
                        onClick={() => setCategory("all")}
                        className={
                            "px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap " +
                            (category === "all"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                        }
                    >
                        All
                    </button>

                    {categories.map(cat => (

                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={
                                "px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap " +
                                (category === cat
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                            }
                        >
                            {cat}
                        </button>

                    ))}

                </div>

            )}

            {filteredProducts.length === 0 ? (

                <p className="text-gray-600 text-lg">
                    No products match your search.
                </p>

            ) : (

                // Flipkart-style compact grid: 2 columns on mobile, more on larger screens
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">

                    {
                        filteredProducts.map(product => (

                            <div
                                key={product.pid}
                                onClick={() => navigate(`/products/${product.pid}`)}
                                className="bg-white rounded-lg md:rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col"
                            >

                                <div className="relative bg-gray-50">

                                    <img
                                        src={product.image}
                                        alt={product.pname}
                                        className={
                                            "w-full aspect-square object-contain p-3 " +
                                            (product.stock <= 0 ? "opacity-50" : "")
                                        }
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/400x300?text=No+Image";
                                        }}
                                    />

                                    {product.stock <= 0 && (

                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">
                                            OUT OF STOCK
                                        </span>

                                    )}

                                </div>

                                <div className="p-2.5 md:p-4 flex flex-col flex-1">

                                    <h2 className="text-xs md:text-base font-medium text-gray-800 line-clamp-2 leading-snug">
                                        {product.pname}
                                    </h2>

                                    {product.category && (

                                        <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">
                                            {product.category}
                                        </span>

                                    )}

                                    <p className="text-green-700 font-bold text-sm md:text-xl mt-1 md:mt-2">
                                        ₹{product.pprice}
                                    </p>

                                </div>

                            </div>

                        ))
                    }

                </div>

            )}

        </div>

    );

}

export default Products;
