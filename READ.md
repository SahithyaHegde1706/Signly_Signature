# 🚀 Signly – MERN eSignature Platform

Signly is a full-stack MERN-based eSignature application that allows users to upload PDFs, place draggable digital signatures, generate signed documents using PDF-Lib, share secure public signing links, and maintain a complete audit trail.

---

## 🌟 Features

### 🔐 Authentication
- User registration & login (JWT-based authentication)
- Password hashing with bcrypt
- Protected API routes

### 📤 Document Management
- Upload PDF documents
- Store file metadata (size, path, upload time)
- View & filter documents by status (Pending / Signed / Rejected)
- Delete documents

### ✍️ Signature Designer
- Drag-and-drop signature placement
- Adjustable font, size, color
- Bold & italic options
- Resize and reposition signature fields
- Save coordinates relative to PDF

### 📄 PDF Processing
- Generate final signed PDF using **PDF-Lib**
- Embed signatures directly into the document
- Save signed version on server

### 🔗 Public Signing
- Generate token-based signing links
- External users can Accept / Reject document
- Expiry-based secure links

### 📜 Audit Trail
- Log document actions (Upload, Link Generation, Sign, Reject)
- Store signer name, timestamp, and IP address
- View audit history per document

### 📊 Dashboard
- Status counters (Pending / Signed / Rejected)
- Search & filter functionality
- Clean Tailwind-based UI

---

## 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- Axios
- React Router
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (File Upload)
- PDF-Lib (PDF Processing)
- JWT Authentication
- bcrypt (Password Hashing)

### Database
- MongoDB Atlas

---
