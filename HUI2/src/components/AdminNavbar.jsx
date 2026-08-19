import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        navigate("/admin-login");
    };

    const links = [
        { to: "/admin", label: "Dashboard" },
        { to: "/sales-dashboard", label: "Sales" },
        { to: "/add-product", label: "Add Product" },
        { to: "/manage-products", label: "Manage Products" },
        { to: "/orders-admin", label: "Orders" },
        { to: "/manage-users", label: "Users" },
        { to: "/manage-coupons", label: "Coupons" },
        { to: "/profile", label: "My Profile" }
    ];

    return (

        <nav className="bg-gray-900 text-white shadow-lg">

            <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-6 md:px-8">

                <h1 className="text-xl md:text-3xl font-bold text-green-400">
                    🌿 HerbalLife Admin
                </h1>

                {/* Desktop Menu */}
                <div className="hidden lg:flex gap-6 flex-wrap items-center text-sm">

                    {links.map(link => (

                        <Link key={link.to} to={link.to} className="hover:text-green-400">
                            {link.label}
                        </Link>

                    ))}

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="lg:hidden text-3xl text-green-400"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (

                <div className="lg:hidden bg-gray-800 border-t border-gray-700 px-6 py-4 flex flex-col gap-4 text-sm">

                    {links.map(link => (

                        <Link
                            key={link.to}
                            to={link.to}
                            className="hover:text-green-400"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>

                    ))}

                    <button
                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                        className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 text-left"
                    >
                        Logout
                    </button>

                </div>

            )}

        </nav>

    );

}

export default AdminNavbar;
