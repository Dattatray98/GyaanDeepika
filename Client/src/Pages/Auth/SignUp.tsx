import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate(); // for redirecting
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/users/signin", {
                firstName,
                lastName,
                email,
                mobile,
                password,
            });
            console.log("Signup success:", response.data);

            navigate("/home");

        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_20px_#00FFFF80] p-5 rounded-xl max-w-[70vh]"
        >
            <div className="mb-[30px]">
                <h1 className="text-[19px] text-white">
                    Create an account with GyaanDeepika and start your learning journey
                </h1>
            </div>

            {/* First Name */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-gray-400 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Enter First Name
                    </span>
                </label>
            </div>

            {/* Last Name */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Enter Last Name
                    </span>
                </label>
            </div>

            {/* Email */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Enter Email
                    </span>
                </label>
            </div>

            {/* Mobile Number */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        pattern="[0-9]{10}"
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Enter Mobile No.
                    </span>
                </label>
            </div>

            {/* Password */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Enter Password
                    </span>
                </label>
            </div>

            {/* Confirm Password */}
            <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
                <label className="relative w-full">
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
                        required
                    />
                    <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
                        Re-enter Password
                    </span>
                </label>
            </div>

            <div className="flex gap-8 items-center justify-evenly">
                <button type="submit" className="bg-blue-400 text-white p-2 rounded w-full h-12 hover:bg-blue-600">
                    Create User
                </button>
                <p className="text-white">Or</p>
                <button
                    type="button"
                    onClick={() => window.location.href = "http://localhost:8000/auth/google"}
                    className="bg-transparent text-white p-2 rounded w-full flex items-center gap-3 max-w-[160px]"
                >
                    Sign Up with <FcGoogle className="h-7 w-7" />

                </button>
            </div>
        </form>
    );
};

export default SignUp;