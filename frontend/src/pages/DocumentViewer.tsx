// FULL PROFESSIONAL VERSION — DB INTEGRATED + FINALIZE SUPPORT

import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const fonts = [
  { name: "Arial", value: "Arial" },
  { name: "Georgia", value: "Georgia" },
  { name: "Courier New", value: "Courier New" },
  { name: "Pacifico", value: "'Pacifico', cursive" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
];

const DocumentViewer = () => {
  const { id } = useParams<{ id: string }>();

  const [fileUrl, setFileUrl] = useState("");
  const [signatures, setSignatures] = useState<any[]>([]);
  const [documentStatus, setDocumentStatus] = useState("pending");
  // 🔥 AUDIT LOG STATE
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Designer States
  const [signatureText, setSignatureText] = useState("");
  const [selectedFont, setSelectedFont] = useState(fonts[0].value);
  const [fontSize, setFontSize] = useState(28);
  const [color, setColor] = useState("#1e40af");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const getToken = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return null;
    return JSON.parse(userInfo).token;
  };

  // ---------------- FETCH DOCUMENT ----------------
  useEffect(() => {
    fetchDocument();
    fetchSignatures();
    fetchAuditLogs(); // 🔥 added
  }, [id]);

  const fetchDocument = async () => {
    const token = getToken();
    if (!token) return;

    const { data } = await axios.get(
      "https://signly-signature.onrender.com/api/docs",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const doc = data.find((d: any) => d._id === id);
    if (doc) {
      setDocumentStatus(doc.status);

      const cleanPath = doc.filePath.startsWith("/")
        ? doc.filePath
        : `/${doc.filePath}`;
      setFileUrl(`https://signly-signature.onrender.com${cleanPath}`);
    }
  };

  // ---------------- FETCH SIGNATURES ----------------
  const fetchSignatures = async () => {
    const token = getToken();
    if (!token) return;

    const { data } = await axios.get(
      `https://signly-signature.onrender.com/api/signatures/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSignatures(data);
  };

  // 🔥 FETCH AUDIT LOGS
  const fetchAuditLogs = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const { data } = await axios.get(
        `https://signly-signature.onrender.com/api/audit/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAuditLogs(data);
    } catch (error) {
      console.log("Audit fetch failed");
    }
  };

  // ---------------- ADD SIGNATURE ----------------
  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (documentStatus === "signed") return;
    if (!containerRef.current || !isAddMode || !signatureText.trim()) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const token = getToken();
    if (!token) return;

    const { data } = await axios.post(
      "https://signly-signature.onrender.com/api/signatures",
      {
        documentId: id,
        x,
        y,
        page: 1,
        text: signatureText,
        font: selectedFont,
        color,
        fontSize,
        isBold,
        isItalic,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSignatures((prev) => [...prev, data]);
    setSignatureText("");
    setIsAddMode(false);
  };
  // ---------------- DRAG + RESIZE ----------------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (documentStatus === "signed") return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    if (draggingId) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setSignatures((prev) =>
        prev.map((sig) =>
          sig._id === draggingId ? { ...sig, x, y } : sig
        )
      );
    }

    if (resizingId) {
      setSignatures((prev) =>
        prev.map((sig) =>
          sig._id === resizingId
            ? {
              ...sig,
              fontSize: Math.max(sig.fontSize + e.movementX * 0.5, 12),
            }
            : sig
        )
      );
    }
  };

  // ---------------- SAVE POSITION ----------------
  const handleMouseUp = async () => {
    if (documentStatus === "signed") return;
    if (!draggingId && !resizingId) return;

    const activeId = draggingId || resizingId;
    const updatedSig = signatures.find((s) => s._id === activeId);
    if (!updatedSig) return;

    const token = getToken();
    if (!token) return;

    await axios.put(
      `https://signly-signature.onrender.com/api/signatures/${activeId}`,
      {
        x: updatedSig.x,
        y: updatedSig.y,
        fontSize: updatedSig.fontSize,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDraggingId(null);
    setResizingId(null);
  };

  // ---------------- DELETE ----------------
  const deleteSignature = async (signatureId: string) => {
    if (documentStatus === "signed") return;

    const token = getToken();
    if (!token) return;

    await axios.delete(
      `https://signly-signature.onrender.com/api/signatures/${signatureId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSignatures((prev) =>
      prev.filter((sig) => sig._id !== signatureId)
    );
  };

  // ---------------- FINALIZE DOCUMENT ----------------
  const finalizeDocument = async () => {
    const token = getToken();
    if (!token) return;

    await axios.post(
      `https://signly-signature.onrender.com/api/docs/${id}/finalize`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Document Signed Successfully ✅");

    fetchDocument();
    fetchAuditLogs(); // Refresh audit logs after finalization
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* LEFT DESIGNER PANEL */}
      <div className="w-80 bg-white p-6 border-r shadow-lg overflow-y-auto space-y-6">
        <h2 className="text-xl font-bold">✍️ Signature Designer</h2>
        {/* 🔥 LIVE SIGNATURE PREVIEW */}
        <div className="mt-4">
          <label className="text-sm font-semibold">
            Live Preview
          </label>

          <div className="mt-2 p-4 border rounded-lg bg-gray-50 min-h-[70px] flex items-center justify-center">
            {signatureText ? (
              <span
                style={{
                  fontFamily: selectedFont,
                  fontSize: `${fontSize}px`,
                  color: color,
                  fontWeight: isBold ? "bold" : "normal",
                  fontStyle: isItalic ? "italic" : "normal",
                }}
              >
                {signatureText}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">
                Signature preview will appear here
              </span>
            )}
          </div>
        </div>
        {documentStatus === "signed" && (
          <div className="p-3 bg-green-100 text-green-700 rounded text-sm font-semibold">
            ✅ This document is signed. Editing disabled.
          </div>
        )}

        <div>
          <label className="text-sm font-semibold">Signature Text</label>
          <input
            value={signatureText}
            disabled={documentStatus === "signed"}
            onChange={(e) => setSignatureText(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Type your name..."
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Font Family</label>
          <select
            disabled={documentStatus === "signed"}
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            {fonts.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">
            Font Size ({fontSize}px)
          </label>
          <input
            type="range"
            min="12"
            max="80"
            disabled={documentStatus === "signed"}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={documentStatus === "signed"}
            onClick={() => setIsBold(!isBold)}
            className={`px-3 py-1 border rounded ${isBold ? "bg-blue-600 text-white" : "bg-white"
              }`}
          >
            Bold
          </button>

          <button
            type="button"
            disabled={documentStatus === "signed"}
            onClick={() => setIsItalic(!isItalic)}
            className={`px-3 py-1 border rounded ${isItalic ? "bg-blue-600 text-white" : "bg-white"
              }`}
          >
            Italic
          </button>
        </div>

        <div>
          <label className="text-sm font-semibold">Color</label>
          <input
            type="color"
            disabled={documentStatus === "signed"}
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 mt-2"
          />
        </div>

        <button
          disabled={documentStatus === "signed"}
          onClick={() => setIsAddMode(true)}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          Add Signature to PDF
        </button>

        {documentStatus === "pending" && (
          <button
            onClick={finalizeDocument}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Finalize & Sign PDF
          </button>
        )}
      </div>

      {/* PDF AREA */}
      <div className="flex-1 p-6">
        {fileUrl && (
          <div
            ref={containerRef}
            className="relative max-w-4xl mx-auto"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isAddMode ? "crosshair" : "default" }}
          >
            <iframe
              src={fileUrl}
              width="100%"
              height="800px"
              className="pointer-events-none"
            />

            {signatures.map((sig) => (
              <div
                key={sig._id}
                className="absolute group"
                style={{
                  left: `${sig.x * 100}%`,
                  top: `${sig.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingId(sig._id);
                  }}
                  className="cursor-move select-none"
                  style={{
                    fontFamily: sig.font,
                    fontSize: `${sig.fontSize}px`,
                    color: sig.color,
                    fontWeight: sig.isBold ? "bold" : "normal",
                    fontStyle: sig.isItalic ? "italic" : "normal",
                  }}
                >
                  {sig.text}
                </div>

                {documentStatus !== "signed" && (
                  <>
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingId(sig._id);
                      }}
                      className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSignature(sig._id);
                      }}
                      className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 🔥 AUDIT HISTORY SECTION */}
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-4">📜 Audit History</h3>

        {auditLogs.length === 0 ? (
          <p className="text-gray-500">No audit records yet.</p>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="font-semibold">{log.action}</div>
                <div className="text-sm text-gray-600">
                  User: {log.userId?.name || "Unknown"}
                </div>
                <div className="text-sm text-gray-600">
                  IP: {log.ipAddress}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default DocumentViewer;