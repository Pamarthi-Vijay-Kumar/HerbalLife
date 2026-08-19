import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

function AdminLogin() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });

    };

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "${API}/login",
                admin
            );

            if (response.data.role !== "ADMIN") {

                alert("This account does not have admin access");

                return;

            }

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("name", response.data.name);

            alert("Admin Login Successful");

            navigate("/admin");

        } catch (error) {

            alert(error.response?.data || "Invalid Admin Credentials");

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-green-50">

            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
                    Admin Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        value={admin.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={admin.password}
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

            </div>

        </div>

    );

}

export default AdminLogin;
