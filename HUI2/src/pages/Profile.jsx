import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword } from "../services/ProfileService";

function Profile() {

    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        dob: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!email) {

            navigate("/login");

            return;

        }

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const response = await getProfile(email);

            setUser(response.data);

            setForm({
                name: response.data.name || "",
                mobile: response.data.mobile || "",
                dob: response.data.dob || ""
            });

        } catch (err) {

            console.log(err);

            setError(
                err.response?.status === 404
                    ? "No profile found for this account. Try logging out and back in."
                    : (err.response?.data || "Failed to load profile. Is the backend running?")
            );

        } finally {

            setLoading(false);

        }

    };

    const handleFormChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSaveProfile = async (e) => {

        e.preventDefault();

        try {

            const response = await updateProfile(email, form);

            setUser(response.data);

            localStorage.setItem("name", response.data.name);

            setEditing(false);

            alert("Profile Updated Successfully");

        } catch (error) {

            console.log(error);

            alert("Failed To Update Profile");

        }

    };

    const handlePasswordFormChange = (e) => {

        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });

    };

    const handleChangePassword = async (e) => {

        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {

            alert("New Password And Confirm Password Do Not Match");

            return;

        }

        try {

            await changePassword(email, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            alert("Password Changed Successfully");

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            setShowPasswordForm(false);

        } catch (error) {

            alert(error.response?.data || "Failed To Change Password");

        }

    };

    if (loading) {

        return (
            <div className="max-w-3xl mx-auto p-10">
                <p>Loading profile...</p>
            </div>
        );

    }

    if (!user) {

        return (
            <div className="max-w-3xl mx-auto p-10">
                <p className="text-red-600">{error || "Could not load profile."}</p>
            </div>
        );

    }

    return (

        <div className="max-w-3xl mx-auto p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-2">
                My Profile
            </h1>

            <p className="text-gray-500 mb-8">
                {user.role === "ADMIN" ? "Administrator Account" : "Customer Account"}
            </p>

            <div className="bg-white shadow-lg rounded-xl p-8 mb-8">

                {!editing ? (

                    <>

                        <div className="space-y-4">

                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-lg font-semibold">{user.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-semibold">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Mobile</p>
                                <p className="text-lg font-semibold">{user.mobile || "-"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Date Of Birth</p>
                                <p className="text-lg font-semibold">{user.dob || "-"}</p>
                            </div>

                        </div>

                        <button
                            onClick={() => setEditing(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-8"
                        >
                            Edit Profile
                        </button>

                    </>

                ) : (

                    <form onSubmit={handleSaveProfile} className="space-y-4">

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Date Of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">

                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}

            </div>

            {/* Change Password */}

            <div className="bg-white shadow-lg rounded-xl p-8">

                <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">
                        Password
                    </h2>

                    {!showPasswordForm && (

                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="text-green-700 font-semibold hover:underline"
                        >
                            Change Password
                        </button>

                    )}

                </div>

                {showPasswordForm && (

                    <form onSubmit={handleChangePassword} className="space-y-4 mt-5">

                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordFormChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />

                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordFormChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordFormChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                            >
                                Update Password
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowPasswordForm(false)}
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>

    );

}

export default Profile;
