import Image from 'next/image';
import Navbar from "./components/Navbar/Navbar.js";
import UsersTable from "./components/UsersTable/UserTable.js";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">USERS</h1>
        <UsersTable />
      </div>
    </div>
  );
}
