import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PublicSign = () => {
  const { token } = useParams<{ token: string }>();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const { data } = await axios.get(
        `https://signly-signature.onrender.com/api/docs/public/${token}`
      );
      setDocument(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid link");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "accept" | "reject") => {
    try {
      await axios.post(
        `https://signly-signature.onrender.com/api/docs/public/${token}/action`,
        {
          action,
          rejectionReason,
        }
      );

      setActionDone(true);
      fetchDocument();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading document...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">{document.title}</h2>

        {/* PDF Preview */}
        <iframe
          src={`https://signly-signature.onrender.com${document.filePath}`}
          width="100%"
          height="600px"
          className="mb-6"
        />

        {/* Status */}
        <div className="mb-6">
          <span className="font-semibold">Current Status:</span>{" "}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              document.status === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : document.status === "signed"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {document.status}
          </span>
        </div>

        {document.status === "rejected" && document.rejectionReason && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
            <strong>Rejection Reason:</strong> {document.rejectionReason}
          </div>
        )}

        {/* Actions */}
        {document.status === "pending" && !actionDone && (
          <div className="space-y-4">

            <button
              onClick={() => handleAction("accept")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              ✅ Accept & Sign
            </button>

            <div>
              <textarea
                placeholder="Reason for rejection (optional)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border rounded-lg p-3 mb-3"
              />

              <button
                onClick={() => handleAction("reject")}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              >
                ❌ Reject Document
              </button>
            </div>

          </div>
        )}

        {actionDone && (
          <div className="mt-6 p-4 bg-green-100 text-green-700 rounded text-center font-semibold">
            Action completed successfully.
          </div>
        )}

      </div>
    </div>
  );
};

export default PublicSign;