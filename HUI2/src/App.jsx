import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import OrdersAdmin from "./pages/OrdersAdmin";
import ManageUsers from "./pages/ManageUsers";
import ManageCoupons from "./pages/ManageCoupons";
import SalesDashboard from "./pages/SalesDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {

    const location = useLocation();

    const role = localStorage.getItem("role");

    const adminPages = [
        "/admin",
        "/add-product",
        "/manage-products",
        "/orders-admin",
        "/manage-users",
        "/manage-coupons",
        "/sales-dashboard"
    ];

    const isAdminPage =
        adminPages.includes(location.pathname) ||
        location.pathname.startsWith("/edit-product/") ||
        (location.pathname === "/profile" && role === "ADMIN");

    return (

        <>

            {
                isAdminPage
                ? <AdminNavbar />
                : <Navbar />
            }

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/products/:pid" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/admin-login" element={<AdminLogin />} />

                <Route path="/admin" element={
                    <AdminRoute><AdminDashboard /></AdminRoute>
                } />

                <Route path="/add-product" element={
                    <AdminRoute><AddProduct /></AdminRoute>
                } />

                <Route path="/edit-product/:pid" element={
                    <AdminRoute><AddProduct /></AdminRoute>
                } />

                <Route path="/manage-products" element={
                    <AdminRoute><ManageProducts /></AdminRoute>
                } />

                <Route path="/orders-admin" element={
                    <AdminRoute><OrdersAdmin /></AdminRoute>
                } />

                <Route path="/manage-users" element={
                    <AdminRoute><ManageUsers /></AdminRoute>
                } />

                <Route path="/manage-coupons" element={
                    <AdminRoute><ManageCoupons /></AdminRoute>
                } />

                <Route path="/sales-dashboard" element={
                    <AdminRoute><SalesDashboard /></AdminRoute>
                } />

            </Routes>

        </>

    );

}

export default App;