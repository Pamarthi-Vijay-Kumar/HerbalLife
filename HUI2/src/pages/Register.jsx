import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        password: ""
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const response = await axios.post(
            "${API}/register",
            user
        );

        alert(response.data);

        // Clear all fields
        setUser({
            name: "",
            email: "",
            mobile: "",
            dob: "",
            password: ""
        });

        // Optional: Redirect to Login page
        // navigate("/login");

    } catch (error) {

        alert(error.response?.data || "Registration Failed");

    }
};

    return (
        <div className="min-h-screen bg-green-50 flex justify-center items-center">

            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={user.mobile}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <input
                        type="date"
                        name="dob"
                        value={user.dob}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Register
                    </button>

                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-green-700 font-semibold ml-2 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;