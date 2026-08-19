import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
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
            "${API}/login",
            user
        );

        // Save login details
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("name", response.data.name);

        alert("Login Successful");

        // Clear form
        setUser({
            email: "",
            password: ""
        });

        // Redirect based on role
        if (response.data.role === "ADMIN") {
            navigate("/admin");
        } else {
            navigate("/");
        }

    } catch (error) {

        alert(error.response?.data || "Login Failed");

    }

};

    return (

        <div className="min-h-screen flex justify-center items-center bg-green-50">

            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <button
                        className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-green-700 font-semibold ml-2"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;