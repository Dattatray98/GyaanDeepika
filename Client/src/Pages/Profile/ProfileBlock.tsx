import axios from "axios";
import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";

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
    axios
      .get("http://localhost:8000/users")
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
    <div className="rounded-xl p-6 w-full bg-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
        <div className="relative">
          <img
            src="/user.png"
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-orange-500 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            <FiUser className="inline" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {user ? user.firstName + " " + user.lastName : "Loading..."}
          </h2>
          <p className="text-sm text-gray-400">Rural Learner</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-gray-700/50">
          <p className="text-xs font-medium mb-1 text-gray-400">Name</p>
          <p className="text-white">{user ? user.firstName + " " + user.lastName : "Loading..."}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-700/50">
          <p className="text-xs font-medium mb-1 text-gray-400">Email</p>
          <p className="text-white">{user ? user.email : "Loading..."}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-700/50">
          <p className="text-xs font-medium mb-1 text-gray-400">Phone</p>
          <p className="text-white">{user?.mobile || "Not provided"}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-700/50">
          <p className="text-xs font-medium mb-1 text-gray-400">Language</p>
          <p className="text-white">{user?.language || "Marathi"}</p>
        </div>
        <div className="p-3 rounded-lg md:col-span-2 bg-gray-700/50">
          <p className="text-xs font-medium mb-1 text-gray-400">Location</p>
          <p className="text-white">{user?.location || "Beed, Maharashtra"}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-center transition-colors">
          Edit Profile
        </button>
        <button className="border border-orange-600 text-orange-500 hover:bg-orange-600/10 px-4 py-2 rounded-lg text-center transition-colors">
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfileBlock;
