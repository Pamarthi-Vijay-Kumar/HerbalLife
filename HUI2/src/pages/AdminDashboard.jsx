import { Link } from "react-router-dom";

function AdminDashboard() {

   return (

    <>
        

        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <Link
                    to="/add-product"
                    className="bg-green-600 text-white p-8 rounded-xl text-2xl text-center hover:bg-green-700"
                >
                    Add Product
                </Link>

                <Link
                    to="/manage-products"
                    className="bg-blue-600 text-white p-8 rounded-xl text-2xl text-center hover:bg-blue-700"
                >
                    Manage Products
                </Link>

                <Link
                    to="/orders-admin"
                    className="bg-orange-600 text-white p-8 rounded-xl text-2xl text-center hover:bg-orange-700"
                >
                    View Orders
                </Link>

                <Link
                    to="/manage-users"
                    className="bg-purple-600 text-white p-8 rounded-xl text-2xl text-center hover:bg-purple-700"
                >
                    Manage Users
                </Link>

                <Link
                    to="/sales-dashboard"
                    className="bg-emerald-700 text-white p-8 rounded-xl text-2xl text-center hover:bg-emerald-800"
                >
                    Sales Dashboard
                </Link>

                <Link
                    to="/manage-coupons"
                    className="bg-pink-600 text-white p-8 rounded-xl text-2xl text-center hover:bg-pink-700"
                >
                    Manage Coupons
                </Link>

            </div>

        </div>

    </>

);
}

export default AdminDashboard;