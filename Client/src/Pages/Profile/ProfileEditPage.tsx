import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, User, Save, Upload, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Common/Loading';
import AOS from 'aos';

type UserProfile = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    language: string;
    avatar: string;
    bio: string;
};

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const { user, token, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [profile, setProfile] = useState<UserProfile>({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        language: '',
        avatar: '',
        bio: '',
    });

    useEffect(() => {
        AOS.init({ duration: 1000, once: true, mirror: false });

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const api = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${api}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !token) return;

        try {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            const api = import.meta.env.VITE_API_URL;
            const response = await axios.put(`${api}/users/edit`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfile((prev) => ({ ...prev, avatar: response.data.user.avatar }));
            if (user && updateUser) updateUser({ ...user, avatar: response.data.user.avatar });
        } catch (err) {
            setError('Failed to update avatar');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            const { _id, avatar, ...body } = profile;
            const api = import.meta.env.VITE_API_URL;
            const response = await axios.put(`${api}/users/edit`, body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (updateUser) updateUser(response.data.user);
            navigate('/ProfilePage');
        } catch (err) {
            setError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0F0F0F] text-white">
                <div className="text-center p-6 bg-gray-800 rounded-lg max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-orange-500">Error</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <header className="bg-gray-800 p-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-orange-500"
                        data-aos="fade-right"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold" data-aos="fade-down">Edit Profile</h1>
                    <div className="w-6"></div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col items-center mb-8" data-aos="fade-up">
                        <div className="relative group">
                            <img
                                src={profile.avatar || '/default-avatar.png'}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors"
                            >
                                <Upload className="w-5 h-5" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setProfile((prev) => ({ ...prev, avatar: '' }))}
                            className="mt-2 text-sm text-red-400 hover:text-red-300 flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove photo
                        </button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6" data-aos="fade-up" data-aos-delay="100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-orange-500" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"                  
                                    value={profile.firstName || ''}  
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"                 
                                    value={profile.lastName || ''}  
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={profile.mobile || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={profile.language || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="block text-sm text-gray-400">Bio</label>
                            <textarea
                                name="bio"
                                value={profile.bio || ''}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditPage;
