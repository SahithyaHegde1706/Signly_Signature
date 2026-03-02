import { useEffect, useState } from "react";
import axios from "axios";
import {
  Download,
  Share2,
  Eye,
  FileText,
  X,
} from "lucide-react";

const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      fetchSignedDocs(parsedUser.token);
    }
  }, []);

  const fetchSignedDocs = async (token: string) => {
    try {
      const { data } = await axios.get(
        "https://signly-signature.onrender.com/api/docs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const signedDocs = data.filter(
        (doc: any) => doc.status === "signed"
      );

      setDocuments(signedDocs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleShare = async (id: string) => {
    try {
      const { data } = await axios.post(
        `https://signly-signature.onrender.com/api/docs/${id}/generate-link`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigator.clipboard.writeText(data.signingLink);
      alert("Share link copied 🔗");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed ❌");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "-";
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Signed Documents</h2>

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Document</th>
              <th className="p-4">Signed By</th>
              <th className="p-4">Size</th>
              <th className="p-4">Signed Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No signed documents found.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    {doc.title}
                  </td>

                  <td className="p-4">
                    {doc.signedBy || "N/A"}
                  </td>

                  <td className="p-4">
                    {formatFileSize(doc.fileSize)}
                  </td>

                  <td className="p-4">
                    {new Date(
                      doc.updatedAt || doc.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-4">

                    {/* Preview */}
                    <button
                      onClick={() =>
                        setPreviewUrl(doc.fileUrl)
                      }
                      className="text-blue-600 hover:scale-110 transition"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Download */}
                    <button
                      onClick={() =>
                        handleDownload(doc.fileUrl)
                      }
                      className="text-green-600 hover:scale-110 transition"
                    >
                      <Download size={18} />
                    </button>

                    {/* Share */}
                    <button
                      onClick={() =>
                        handleShare(doc._id)
                      }
                      className="text-purple-600 hover:scale-110 transition"
                    >
                      <Share2 size={18} />
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 h-5/6 rounded-2xl shadow-xl relative">
            
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
            >
              <X size={20} />
            </button>

            <iframe
              src={previewUrl}
              className="w-full h-full rounded-2xl"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;