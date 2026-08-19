import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AddProduct() {

    const navigate = useNavigate();
    const { pid } = useParams();

    const [product, setProduct] = useState({
        pid: "",
        pname: "",
        ping: "",
        pprice: "",
        pdesc: "",
        image: "",
        category: "",
        stock: ""
    });

    const [extraImages, setExtraImages] = useState([""]);

    useEffect(() => {

        if (pid) {
            loadProduct();
        }

    }, [pid]);

    const loadProduct = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8082/products/${pid}`
            );

            setProduct(response.data);

            if (response.data.images && response.data.images.length > 0) {

                setExtraImages(response.data.images);

            }

        } catch (error) {

            alert("Failed To Load Product");

        }

    };

    const handleChange = (e) => {

        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });

    };

    const handleExtraImageChange = (index, value) => {

        const updated = [...extraImages];

        updated[index] = value;

        setExtraImages(updated);

    };

    const addImageField = () => {

        setExtraImages([...extraImages, ""]);

    };

    const removeImageField = (index) => {

        setExtraImages(extraImages.filter((_, i) => i !== index));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {
            ...product,
            images: extraImages.filter(img => img.trim() !== "")
        };

        try {

            if (pid) {

                await axios.put(
                    `http://localhost:8082/products/${pid}`,
                    payload
                );

                alert("Product Updated Successfully");

            } else {

                await axios.post(
                    "http://localhost:8082/products",
                    payload
                );

                alert("Product Added Successfully");

            }

            navigate("/manage-products");

        } catch (error) {

            alert("Operation Failed");

        }

    };

    return (

        <div className="max-w-3xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-8">

                {pid ? "Update Product" : "Add Product"}

            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                <input
                    type="number"
                    name="pid"
                    value={product.pid}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    placeholder="Product ID"
                    readOnly={pid}
                    required
                />

                <input
                    type="text"
                    name="pname"
                    value={product.pname}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    placeholder="Product Name"
                    required
                />

                <input
                    type="text"
                    name="category"
                    value={product.category || ""}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    placeholder="Category (e.g. Protein, Vitamins, Herbal Tea)"
                />

                <input
                    type="text"
                    name="ping"
                    value={product.ping}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    placeholder="Ingredients"
                    required
                />

                <div className="grid grid-cols-2 gap-5">

                    <input
                        type="number"
                        name="pprice"
                        value={product.pprice}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        placeholder="Price"
                        required
                    />

                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        placeholder="Stock Quantity"
                        min="0"
                        required
                    />

                </div>

                <textarea
                    name="pdesc"
                    value={product.pdesc}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    rows="4"
                    placeholder="Description"
                    required
                />

                <input
                    type="text"
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    placeholder="Main Image URL"
                    required
                />

                <div>

                    <label className="block font-medium mb-2">
                        Additional Gallery Images (optional)
                    </label>

                    {extraImages.map((img, index) => (

                        <div key={index} className="flex gap-2 mb-2">

                            <input
                                type="text"
                                value={img}
                                onChange={(e) => handleExtraImageChange(index, e.target.value)}
                                className="flex-1 border p-3 rounded-lg"
                                placeholder={`Image URL ${index + 1}`}
                            />

                            {extraImages.length > 1 && (

                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="bg-red-100 text-red-600 px-4 rounded-lg hover:bg-red-200"
                                >
                                    Remove
                                </button>

                            )}

                        </div>

                    ))}

                    <button
                        type="button"
                        onClick={addImageField}
                        className="text-green-700 font-semibold text-sm hover:underline"
                    >
                        + Add Another Image
                    </button>

                </div>

                <button
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
                >
                    {pid ? "Update Product" : "Save Product"}
                </button>

            </form>

        </div>

    );

}

export default AddProduct;
