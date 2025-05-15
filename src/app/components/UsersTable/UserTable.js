"use client"
import { useState, useEffect } from "react";

// client-side function to send a log
async function sendLog(level, message) {
  try {
    const res = await fetch('/api/logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message })
    });
    if (!res.ok) {
      console.error('Failed to send log:', await res.text());
    }
  } catch (error) {
    console.error('Error sending log:', error);
  }
}

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  // Global error logging
  useEffect(() => {
    // Handler for general JavaScript errors
    const handleGlobalError = (message, source, lineno, colno, error) => {
      sendLog('error', `Global error: ${message} at ${source}:${lineno}:${colno} - ${error?.stack || ''}`);
    };

    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      sendLog('error', `Unhandled promise rejection: ${event.reason}`);
    };

    // Register the handlers
    window.onerror = handleGlobalError;
    window.onunhandledrejection = handleUnhandledRejection;

    // Cleanup on unmount
    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/getUsers');
        if (!res.ok) {
          sendLog("error", `Failed to fetch users`);
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        // Transform keys if necessary
        const processedUsers = data.users.map(user => ({
          id: user.id,
          name: user.name,
          age: user.age,
          email: user.email,
          position: user.position,
          department: user.department,
          isActive: user.is_active,  // Convert to camelCase
          createdAt: user.created_at // Convert to camelCase
        }));
        setUsers(processedUsers);
        sendLog("info", `Users fetched successfully.`);

      } catch (error) {
        console.error('Error fetching users:', error);
        sendLog("error", `Error fetching users: ${error}`);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Age</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Position</th>
            <th scope="col" className="px-6 py-3">Department</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4">{user.age}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.position}</td>
              <td className="px-6 py-4">{user.department}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;