# Signly – Digital Document Signing Platform ✍️📄

Signly is a modern MERN stack based digital document signing platform that allows users to upload PDF documents, place digital signatures, manage signing workflows, and track document activities securely.

The platform provides an intuitive interface for document signing with features like drag-and-drop signature placement, document finalization, audit history tracking, and role-based dashboards.

---

## Features

- Secure JWT Authentication
- User & Admin Role-Based Access
- Upload and View PDF Documents
- Digital Signature Placement
- Drag & Resize Signatures
- Signature Styling (Font, Color, Bold, Italic)
- Document Finalization Workflow
- Audit History Tracking
- Responsive UI with Tailwind CSS
- MERN Stack Architecture

## Tech Stack

### Frontend:-
* React.js
* TypeScript
* Tailwind CSS
* React Router
* Axios

### Backend:-
* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Other Tools & Services:-
* Multer (File Uploads)
* Git & GitHub
* Render (Backend Deployment)
* Vercel (Frontend Deployment)

## Authentication System
Signly uses JWT-based authentication for secure access.

### Roles:-
* User
* Admin

### Features:-
* Login / Signup
* Protected Routes
* Role-Based Navigation
* Persistent Login Sessions

## Core Modules

## 1️⃣ Document Upload Module:-
Users can upload PDF documents securely.

### Features:-
* PDF Upload Support
* Server-side File Storage
* Document Metadata Management

## 2️⃣ Document Viewer Module:-
PDF files are displayed directly inside the browser using an iframe-based viewer.

### Features:-
* Live PDF Preview
* Embedded Viewer
* Clean UI

## 3️⃣ Digital Signature Module:-
Users can place signatures anywhere on the PDF.

### Features:-
* Click-to-place Signature
* Drag & Move Signature
* Resize Signature
* Signature Styling Options

## 4️⃣ Audit Log Module:-
Tracks all document-related activities.

### Tracks:-
* Signature Actions
* User Details
* IP Address
* Timestamp Logs

## 5️⃣ Admin Dashboard:-
Admins can monitor system activities and manage documents.

### Features:-
* User Monitoring
* Document Management
* Audit Visibility

## Signature Customization:-
Users can customize signatures using:-
* Multiple Fonts
* Adjustable Font Size
* Color Picker
* Bold / Italic Styles

## Screenshots:-
<img width="1509" height="837" alt="WhatsApp Image 2026-05-20 at 1 49 46 PM" src="https://github.com/user-attachments/assets/277b9ad1-bbe5-4480-a38e-b21950b7d98c" />

<img width="1527" height="911" alt="WhatsApp Image 2026-05-20 at 1 49 47 PM" src="https://github.com/user-attachments/assets/be267a14-b17d-4405-98b7-ab84fcdcb93b" />

<img width="1600" height="764" alt="WhatsApp Image 2026-05-20 at 1 49 47 PM (1)" src="https://github.com/user-attachments/assets/93254aab-46e6-42a1-b9c1-22e828a7c64e" />


# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/your-username/signly.git
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Backend Setup

```bash
cd backend
npm install
npm run server
```

---

# 🌐 Environment Variables

Create a `.env` file inside backend folder:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

---

# 🚀 Deployment

## Frontend

Deployed on Vercel

## Backend

Deployed on Render

---

# 📈 Future Enhancements

➜ Multi-user document signing
➜ Email notification system
➜ Download signed PDFs
➜ Cloud storage integration
➜ Real-time collaboration
➜ Mobile application support

---

# ⚠️ Limitations

* No payment integration
* Limited multi-document workflow
* No real-time notifications
* Single document signing flow

---

# 🎯 Conclusion

Signly simplifies digital document signing using a modern MERN stack architecture.

The platform demonstrates real-world implementation of:

* Authentication
* File Handling
* PDF Management
* Signature Workflows
* Audit Tracking

It provides a scalable foundation for future SaaS-based document signing solutions.

---

# 👨‍💻 Author

### Sahithya Hegde

Passionate Full Stack Developer focused on building modern web applications using the MERN stack.

---

# 🔗 Explore Signly Here

🚀 Live Demo: YOUR_LINK_HERE
💻 GitHub Repository: YOUR_GITHUB_LINK_HERE

---

# 📚 References

* React.js Documentation
* Node.js Documentation
* Express.js Documentation
* MongoDB Documentation
* JWT Documentation
* Tailwind CSS Documentation
