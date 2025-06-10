import { Link } from "react-router-dom";


const ProfileBlock = () => {
    return (
        <div className="w-full border-2 border-red-800 mb-5 rounded-[8px]">
            <div className="bg-white rounded-xl shadow-lg w-full p-6 ">
                {/* Header */}
                <div className="flex items-center gap-5 border-b pb-5 mb-5">
                    <img
                        src="/user.png"
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-4 border-orange-400 object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Username</h2>
                        <p className="text-sm text-gray-500">Rural Learner | Class Name</p>
                    </div>
                </div>

                {/* Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <div>
                        <p className="font-medium">Name:</p>
                        <p>User Name</p>
                    </div>
                    <div>
                        <p className="font-medium">Email:</p>
                        <p>email@example.com</p>
                    </div>
                    <div>
                        <p className="font-medium">Phone:</p>
                        <p>+91 xxxxxxxxxx</p>
                    </div>
                    <div>
                        <p className="font-medium">Language Preference:</p>
                        <p>Marathi</p>
                    </div>
                    <div>
                        <p className="font-medium">Location:</p>
                        <p>Beed, Maharashtra</p>
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
