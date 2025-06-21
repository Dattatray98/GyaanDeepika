import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, token, googleLogin } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_20px_#00FFFF80] p-5 rounded-xl max-w-[70vh]"
    >
      <div className="mb-[30px]">
        <h1 className="text-[19px] text-white">
          Welcome back to <strong>GyaanDeepika</strong> — please log in to continue learning.
        </h1>
      </div>

      {/* Email */}
      <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-10">
        <label htmlFor="email" className="relative w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-white pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 peer-valid:text-white">
            Enter Email
          </span>
        </label>
      </div>

      {/* Password */}
      <div className="flex h-[40px] w-full items-center justify-center bg-transparent mb-6">
        <label htmlFor="password" className="relative w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-[40px] w-full px-4 py-2 text-lg outline-none border border-[#CBCBCB] rounded hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-white pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 peer-valid:text-white">
            Password
          </span>
        </label>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 duration-200"
      >
        Login
      </button>

      {/* OR separator */}
      <div className="text-center text-white my-4">or</div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={googleLogin}
        className="bg-transparent text-white p-2 rounded w-full flex gap-3 justify-center"
      >
        Sign in with Google <FcGoogle className="h-7 w-7 flex " />
      </button>
    </form>
  );
};

export default Login;