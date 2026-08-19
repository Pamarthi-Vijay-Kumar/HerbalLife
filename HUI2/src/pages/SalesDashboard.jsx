import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/DashboardService";

function SalesDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadStats();

    }, []);

    const loadStats = async () => {

        try {

            const response = await getDashboardStats();

            setStats(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="max-w-7xl mx-auto p-10">
                <p>Loading dashboard...</p>
            </div>
        );

    }

    if (!stats) {

        return (
            <div className="max-w-7xl mx-auto p-10">
                <p className="text-red-600">Failed to load dashboard stats.</p>
            </div>
        );

    }

    const maxRevenue = Math.max(...stats.revenueTrend.map(p => p.revenue), 1);
    const maxSold = Math.max(...stats.bestSellers.map(p => p.sold), 1);

    return (

        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Sales Dashboard
            </h1>

            {/* Summary Cards */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

                <div className="bg-green-600 text-white rounded-xl p-6">
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">₹ {stats.totalRevenue}</p>
                </div>

                <div className="bg-blue-600 text-white rounded-xl p-6">
                    <p className="text-sm opacity-90">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>

                <div className="bg-purple-600 text-white rounded-xl p-6">
                    <p className="text-sm opacity-90">Total Users</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>

                <div className="bg-orange-600 text-white rounded-xl p-6">
                    <p className="text-sm opacity-90">Total Products</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Trend Chart */}

                <div className="bg-white shadow-lg rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Revenue — Last 7 Days
                    </h2>

                    <div className="flex items-end justify-between gap-2 h-56">

                        {stats.revenueTrend.map((point) => (

                            <div key={point.date} className="flex flex-col items-center flex-1">

                                <span className="text-xs text-gray-500 mb-1">
                                    ₹{point.revenue}
                                </span>

                                <div
                                    className="w-full bg-green-500 rounded-t-md transition-all"
                                    style={{
                                        height: `${Math.max((point.revenue / maxRevenue) * 180, 4)}px`
                                    }}
                                />

                                <span className="text-xs text-gray-500 mt-2">
                                    {point.date.slice(5)}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Best Sellers Chart */}

                <div className="bg-white shadow-lg rounded-xl p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Best Sellers
                    </h2>

                    {stats.bestSellers.length === 0 ? (

                        <p className="text-gray-500">No sales data yet.</p>

                    ) : (

                        <div className="space-y-4">

                            {stats.bestSellers.map((item) => (

                                <div key={item.name}>

                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-gray-500">{item.sold} sold</span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-3">

                                        <div
                                            className="bg-blue-600 h-3 rounded-full"
                                            style={{
                                                width: `${(item.sold / maxSold) * 100}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* Low Stock Alerts */}

            {stats.lowStock.length > 0 && (

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">

                    <h2 className="text-xl font-bold text-red-700 mb-4">
                        ⚠ Low Stock Alerts
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {stats.lowStock.map((item, index) => (

                            <span
                                key={index}
                                className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
                            >
                                {item.pname} — {item.stock > 0 ? `${item.stock} left` : "Out of stock"}
                            </span>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}

export default SalesDashboard;
