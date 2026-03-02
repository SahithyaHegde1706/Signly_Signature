import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const getToken = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;
    return JSON.parse(userInfo).token;
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchDocuments();
  }, []);

  const fetchStats = async () => {
    const token = getToken();
    const { data } = await axios.get(
      "https://signly-signature.onrender.com/api/admin/stats",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStats(data);
  };

  const fetchUsers = async () => {
    const token = getToken();
    const { data } = await axios.get(
      "https://signly-signature.onrender.com/api/admin/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(data);
  };

  const fetchDocuments = async () => {
    const token = getToken();
    const { data } = await axios.get(
      "https://signly-signature.onrender.com/api/admin/documents",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDocuments(data);
  };

  const deleteUser = async (id: string) => {
    const token = getToken();
    await axios.delete(
      `https://signly-signature.onrender.com/api/admin/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchUsers();
  };

  // 🔥 NEW — DELETE DOCUMENT
  const deleteDocument = async (id: string) => {
    const token = getToken();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmDelete) return;

    await axios.delete(
      `https://signly-signature.onrender.com/api/admin/documents/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchDocuments();
    fetchStats(); // update stats after delete
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">

        <h2 className="text-3xl font-bold text-gray-900">
          👑 Admin Dashboard
        </h2>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-6">
          <StatCard title="Users" value={stats.totalUsers} />
          <StatCard title="Documents" value={stats.totalDocuments} />
          <StatCard title="Signed" value={stats.signed} color="text-green-600" />
          <StatCard title="Pending" value={stats.pending} color="text-yellow-500" />
          <StatCard title="Rejected" value={stats.rejected} color="text-red-500" />
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <h3 className="p-4 font-semibold border-b">Users</h3>
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DOCUMENTS TABLE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <h3 className="p-4 font-semibold border-b">All Documents</h3>
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th> {/* 🔥 Added */}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="border-t">
                  <td className="p-4">{doc.title}</td>
                  <td className="p-4">{doc.uploadedBy?.name}</td>
                  <td className="p-4">{doc.status}</td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteDocument(doc._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value || 0}</p>
  </div>
);

export default AdminDashboard;