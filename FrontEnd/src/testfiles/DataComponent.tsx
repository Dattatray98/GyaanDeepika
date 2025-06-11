import React, { useState } from "react";
import axios from "axios";

const DataComponent = () => {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
      <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2" />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-2" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2" />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} className="border p-2" />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create User</button>
    </form>
  );
};

export default DataComponent;



