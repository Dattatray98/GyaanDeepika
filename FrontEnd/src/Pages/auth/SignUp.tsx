import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/users", formData);
      alert("✅ User Created!");
      console.log(res.data);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Failed to create user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto border-2 border-white bg-purple-300">=


      {/* Full Name */}
      <div className="flex h-[40px] w-[50vh] items-center justify-center bg-transparent mb-5">
        <label htmlFor="email" className="relative w-full">
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            className="h-[40px] w-[50vh] px-4 py-2 text-lg outline-none border-[1px] border-[#CBCBCB] rounded-[6px] hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-[#F7F8F9] ml-[10px] peer-valid:text-sm peer-valid:-translate-y-5">
            Enter FullName
          </span>
        </label>
      </div>


      {/* Last Name */}
      <div className="flex h-[40px] w-[50vh] items-center justify-center bg-transparent mb-5">
        <label htmlFor="email" className="relative w-full">
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            className="h-[40px] w-[50vh] px-4 py-2 text-lg outline-none border-[1px] border-[#CBCBCB] rounded-[6px] hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-[#F7F8F9] ml-[10px] peer-valid:text-sm peer-valid:-translate-y-5">
            Enter LastName
          </span>
        </label>
      </div>

      
      {/* Email */}
      <div className="flex h-[40px] w-[50vh] items-center justify-center bg-transparent mb-5">
        <label htmlFor="email" className="relative w-full">
          <input
            type="Email"
           name="email" 
            onChange={handleChange}
            className="h-[40px] w-[50vh] px-4 py-2 text-lg outline-none border-[1px] border-[#CBCBCB] rounded-[6px] hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-[#F7F8F9] ml-[10px] peer-valid:text-sm peer-valid:-translate-y-5">
            Enter Email
          </span>
        </label>
      </div>


  {/* Mobile */}
      <div className="flex h-[40px] w-[50vh] items-center justify-center bg-transparent mb-5">
        <label htmlFor="email" className="relative w-full">
          <input
            type="number"
        name="mobile"
            onChange={handleChange}
            className="h-[40px] w-[50vh] px-4 py-2 text-lg outline-none border-[1px] border-[#CBCBCB] rounded-[6px] hover:border-[#CBCBCB] duration-200 peer focus:border-indigo-600 bg-inherit"
            required
          />
          <span className="absolute left-0 top-2 px-1 text-[16px] tracking-wide peer-focus:text-indigo-600 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 bg-[#F7F8F9] ml-[10px] peer-valid:text-sm peer-valid:-translate-y-5">
            Enter Mobile no.
          </span>
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create User</button>

    </form>
  );
};

export default SignUp;



