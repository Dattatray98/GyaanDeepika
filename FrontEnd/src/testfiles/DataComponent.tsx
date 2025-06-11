// DataComponent.tsx or UserList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string; // or your field names
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from backend on component mount
  useEffect(() => {
    axios.get("http://localhost:8000/users") // use your deployed backend URL in production
      .then((response) => {
        setUsers(response.data); // set users into state
      })
      .catch((error) => {
        console.error("❌ Error fetching users:", error.message);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="border p-2 rounded shadow">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
