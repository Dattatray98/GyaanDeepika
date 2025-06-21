import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  
  const { signup, googleLogin, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });
      navigate("/home");
    } catch (err) {
      // Error handled in AuthContext
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

      {error && (
        <div className="mb-4 p-2 bg-red-500/20 text-red-300 rounded text-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      {['firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword'].map((field) => (
        <div key={field} className="flex h-[40px] w-full items-center justify-center bg-transparent mb-6">
          <label className="relative w-full">
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="h-[40px] w-full px-2 py-2 text-lg outline-none border border-[#CBCBCB] rounded duration-200 peer focus:border-indigo-600 bg-inherit"
              required
              pattern={field === 'mobile' ? '[0-9]{10}' : undefined}
            />
            <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-7 bg-transparent ml-[3px] peer-valid:text-sm peer-valid:-translate-y-7 text-white">
              {field === 'confirmPassword' ? 'Confirm Password' : `Enter ${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
            </span>
          </label>
        </div>
      ))}

      <div className="flex gap-8 items-center justify-evenly">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-400 text-white p-2 rounded w-full h-12 hover:bg-blue-600 disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Create User'}
        </button>
        <p className="text-white">Or</p>
        <button
          type="button"
          onClick={googleLogin}
          disabled={loading}
          className="bg-transparent text-white p-2 rounded w-full flex items-center gap-3 max-w-[160px] border border-gray-600 hover:border-gray-400"
        >
          Sign Up with <FcGoogle className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SignUp;