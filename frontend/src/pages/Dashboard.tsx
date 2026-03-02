import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      fetchDocuments(parsedUser.token);
    }
  }, []);

  const fetchDocuments = async (token: string) => {
    try {
      const { data } = await axios.get(
        "https://signly-signature.onrender.com/api/docs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocuments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      await axios.post(
        "https://signly-signature.onrender.com/api/docs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchDocuments(user.token);
      alert("Document uploaded successfully ✅");
    } catch (error: any) {
      alert(error.response?.data?.message || "Upload failed ❌");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    try {
      await axios.delete(
        `https://signly-signature.onrender.com/api/docs/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      fetchDocuments(user.token);
      alert("Deleted successfully ✅");
    } catch (error: any) {
      alert(error.response?.data?.message || "Delete failed ❌");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (!user) return;

    try {
      await axios.put(
        `https://signly-signature.onrender.com/api/docs/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      fetchDocuments(user.token);
    } catch (error: any) {
      alert(error.response?.data?.message || "Status update failed ❌");
    }
  };

  const generatePublicLink = async (id: string) => {
    if (!user) return;

    try {
      const { data } = await axios.post(
        `https://signly-signature.onrender.com/api/docs/${id}/generate-link`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      alert(`Public Signing Link:\n${data.signingLink}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Link generation failed ❌");
    }
  };

  const filteredDocuments = documents
    .filter((doc) =>
      filterStatus === "all" ? true : doc.status === filterStatus
    )
    .filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
    );

  const totalDocs = documents.length;
  const pendingDocs = documents.filter(
    (doc) => doc.status === "pending"
  ).length;
  const signedDocs = documents.filter(
    (doc) => doc.status === "signed"
  ).length;
  const rejectedDocs = documents.filter(
    (doc) => doc.status === "rejected"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Good afternoon, {user?.name} 👋
        </h2>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Completed" value={signedDocs} color="text-green-600" />
        <StatCard title="Pending" value={pendingDocs} color="text-yellow-500" />
        <StatCard title="Rejected" value={rejectedDocs} color="text-red-500" />
        <StatCard title="Total Documents" value={totalDocs} />
      </div>

      {/* Filter + Upload */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex justify-between items-center flex-wrap gap-4">

        <div className="flex gap-3 flex-wrap">
          {["all", "pending", "signed", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            onClick={handleFileClick}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Upload
          </button>

          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr key={doc._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{doc.title}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : doc.status === "signed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-4 flex-wrap">
                    <button
                      onClick={() => navigate(`/document/${doc._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => generatePublicLink(doc._id)}
                      className="text-purple-600 hover:underline"
                    >
                      Generate Link
                    </button>

                    {doc.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(doc._id, "signed")
                          }
                          className="text-green-600 hover:underline"
                        >
                          Mark Signed
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(doc._id, "rejected")
                          }
                          className="text-yellow-600 hover:underline"
                        >
                          Mark Rejected
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color = "text-gray-900",
}: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className={`text-2xl font-bold mt-2 ${color}`}>
      {value}
    </p>
  </div>
);

export default Dashboard;