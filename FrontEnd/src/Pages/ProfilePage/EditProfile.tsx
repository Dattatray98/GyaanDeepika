import React, { useState } from 'react';
import axios from 'axios';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  language: string;
  location: string;
}

const EditProfile: React.FC = () => {
  const userId = 'REPLACE_WITH_USER_ID'; // TODO: Dynamically get this based on logged-in user
  const [profile, setProfile] = useState<ProfileData>({
    fullName: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '9876543210',
    language: 'Hindi',
    location: 'Wardha, Maharashtra',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:8000/users/${userId}`, profile);
      alert('✅ Profile updated successfully!');
      console.log("Updated user:", response.data.user);
    } catch (error: any) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">✏️ Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Preferred Language</label>
          <select
            name="language"
            value={profile.language}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          >
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Telugu</option>
            <option>Kannada</option>
            <option>Gujarati</option>
            <option>Tamil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
