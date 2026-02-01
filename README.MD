# 📝 Blogify – Full Stack Blogging Platform

Blogify is a **full-stack blogging platform** built using **Node.js, Express, MongoDB, and EJS**, featuring authentication, blog management, comments, likes, and a modern minimal UI with glassmorphism.

---

## 🚀 Features

### 🔐 Authentication
- User Signup & Signin
- JWT-based authentication
- Secure cookies
- Auto-login after signup
- Logout support

### 📝 Blogs
- Create, edit, and delete blogs (owner only)
- Blog image URL support
- Blog detail page
- Latest blogs on homepage
- Author name & publish date

### 💬 Comments
- Add comments (logged-in users)
- Delete own comments
- AJAX-based like system (no page refresh)
- Comment count shown on blog cards

### 🎨 UI / UX
- Minimal dark theme
- Glassmorphism blog & comment cards
- Sticky footer on all pages
- Responsive design (Bootstrap 5)
- Clean typography & spacing

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, Bootstrap 5, CSS  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT + Cookies  
- **Templating:** EJS  

---

## 📂 Project Structure

```bash
Blogify/
│
├── models/
│   ├── user.js
│   ├── blog.js
│   └── comment.js
│
├── routes/
│   ├── user.js
│   └── blog.js
│
├── services/
│   └── authentication.js
│
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── nav.ejs
│   │   └── footer.ejs
│   ├── homepage.ejs
│   ├── blogDetail.ejs
│   ├── addBlog.ejs
│   ├── signin.ejs
│   └── signup.ejs
│
├── public/
│   └── images/
│
├── index.js
├── package.json
└── README.md
