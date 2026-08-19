import { useEffect, useState } from "react";
import {
    getAllUsers,
    updateUserRole,
    toggleUserBlock,
    deleteUser
} from "../services/UserService";

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentAdminEmail = localStorage.getItem("email");

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            const response = await getAllUsers();

            setUsers(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleRoleChange = async (id, role) => {

        try {

            await updateUserRole(id, role);

            setUsers(users.map(u => u.id === id ? { ...u, role } : u));

        } catch (error) {

            console.log(error);

            alert("Failed To Update Role");

        }

    };

    const handleToggleBlock = async (user) => {

        try {

            const newBlocked = !user.blocked;

            await toggleUserBlock(user.id, newBlocked);

            setUsers(users.map(u =>
                u.id === user.id ? { ...u, blocked: newBlocked } : u
            ));

        } catch (error) {

            console.log(error);

            alert("Failed To Update User Status");

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this user permanently?")) {
            return;
        }

        try {

            await deleteUser(id);

            setUsers(users.filter(u => u.id !== id));

        } catch (error) {

            console.log(error);

            alert("Failed To Delete User");

        }

    };

    return (

        <div className="max-w-7xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Manage Users
            </h1>

            {loading ? (

                <p>Loading users...</p>

            ) : users.length === 0 ? (

                <p className="text-gray-600">No Users Found</p>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">

                        <thead className="bg-gray-900 text-white">

                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Mobile</th>
                                <th className="p-4 text-left">Role</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {users.map(user => (

                                <tr key={user.id} className="border-b">

                                    <td className="p-4">{user.name}</td>

                                    <td className="p-4">{user.email}</td>

                                    <td className="p-4">{user.mobile}</td>

                                    <td className="p-4">

                                        <select
                                            value={user.role}
                                            disabled={user.email === currentAdminEmail}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="border rounded-lg p-2 disabled:opacity-50"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>

                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={
                                                "px-3 py-1 rounded-full text-xs font-semibold " +
                                                (user.blocked
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700")
                                            }
                                        >
                                            {user.blocked ? "Blocked" : "Active"}
                                        </span>

                                    </td>

                                    <td className="p-4 flex gap-3">

                                        <button
                                            onClick={() => handleToggleBlock(user)}
                                            disabled={user.email === currentAdminEmail}
                                            className={
                                                "px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50 " +
                                                (user.blocked
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-yellow-600 hover:bg-yellow-700")
                                            }
                                        >
                                            {user.blocked ? "Unblock" : "Block"}
                                        </button>

                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={user.email === currentAdminEmail}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                                        >
                                            Delete
                                        </button>

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

export default ManageUsers;
