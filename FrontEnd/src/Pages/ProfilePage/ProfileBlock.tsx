import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile?: string;
    language?: string;
    location?: string;
}

const ProfileBlock: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios.get("http://localhost:8000/users") // ⬅ Change this to your deployed backend URL
            .then((response) => {
                if (response.data.length > 0) {
                    setUser(response.data[0]);
                }
            })
            .catch((error) => {
                console.error("❌ Error fetching users:", error.message);
            });
    }, []);

    return (
        <div className="flex w-full border-[0.5px] border-gray-700 rounded-xl mb-10">
            <div className="bg-white border-green-800 rounded-xl shadow-lg w-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white p-6">
                {/* Header */}
                <div className="flex items-center gap-5 border-b pb-5 mb-5">
                    <img
                        src="/user.png"
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-green-800 object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-400">
                            {user ? user.firstName + " " + user.lastName : "Loading..."}
                        </h2>
                        <p className="text-sm text-gray-500">Rural Learner | Class Name</p>
                    </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                    <div>
                        <p className="font-medium">Name:</p>
                        <p>{user ? user.firstName + " " + user.lastName : "Loading..."}</p>
                    </div>
                    <div>
                        <p className="font-medium">Email:</p>
                        <p>{user ? user.email : "Loading..."}</p>
                    </div>
                    <div>
                        <p className="font-medium">Phone:</p>
                        <p>{user?.mobile || "Not Provided"}</p>
                    </div>
                    <div>
                        <p className="font-medium">Language Preference:</p>
                        <p>{user?.language || "Marathi"}</p>
                    </div>
                    <div>
                        <p className="font-medium">Location:</p>
                        <p>{user?.location || "Beed, Maharashtra"}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link to="/ProfileEdit" className="bg-orange-500 text-white px-5 py-2 rounded-lg w-full sm:w-auto">
                        Edit Profile
                    </Link>
                    <Link to="/CourseDashboard" className="border border-orange-500 text-orange-500 px-5 py-2 rounded-lg w-full sm:w-auto">
                        View Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileBlock;
