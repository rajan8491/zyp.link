# 🔗 ZypLink – URL Shortener with Analytics  

A URL shortener service built with **Node.js, Express, Drizzle ORM, PostgreSQL, and NanoID**.  
It allows users to create short links with **custom aliases**, set **expiration dates**, and track **real-time analytics**.  

---

## ✨ Features  

- ✅ Generate short URLs using [nanoid](https://github.com/ai/nanoid)  
- ✅ Support **custom aliases** (e.g. `/raj123`)  
- ✅ Set **expiration dates** for links  
- ✅ **Redirection** from short URL → original URL  
- ✅ **Analytics tracking**  
  - Total clicks  
  - Unique visitors (via IP/User-Agent)  
  - Referrers (where the link was clicked from)  
  - Device / Browser info  
- ✅ **Real-time updates** with Socket.io (live dashboard)  
- ✅ RESTful API with JSON responses  

---

## 🛠 Tech Stack  

- **Backend:** Node.js, Express  
- **Database:** PostgreSQL + Drizzle ORM  
- **ID Generation:** nanoid  
- **Real-time:** Socket.io  
- **Environment:** dotenv  

---

## 📂 Project Structure  

```
zyp-link/
│── db/
│   ├── index.js        # DB connection
│   ├── schema/
│   │   └── url.schema.js
│   │   └── clicks.schema.js
│── routes/
│   └── url.routes.js   # Routes for URL shorten + redirect
│── app.js              # Express app
│── server.js           # Entry point (with socket.io)
│── package.json
│── README.md
```

---

## 🚀 Getting Started  

### 1. Clone repo  
```bash
git clone https://github.com/your-username/zyp-link.git
cd zyp-link
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Setup environment  
Create a `.env` file:  
```env
DATABASE_URL=postgres://username:password@localhost:5432/zypdb
PORT=5000
BASE_URL=http://localhost:5000
```

### 4. Run migrations  
```bash
npx drizzle-kit push
```

### 5. Start server  
```bash
npm run dev
```

---

## 📌 API Endpoints  

### 🔹 Create Short URL  
```http
POST /shortcode
```
**Body:**  
```json
{
  "URL": "https://example.com",
  "customCode": "raj123",      // optional
  "expiresAt": "2025-09-01"   // optional
}
```

**Response:**  
```json
{
  "shortURL": "https://zyp.link/raj123"
}
```

---

### 🔹 Redirect to Original URL  
```http
GET /:code
```
Redirects to original URL if valid & not expired.  

---

### 🔹 Get Original URL via API  
```http
GET /org-url/:code
```
**Response:**  
```json
{
  "originalURL": "https://example.com"
}
```

---

### 🔹 Analytics (Live Updates)  
- Server emits real-time events for clicks:  
  - Channel: `click:<shortCode>`  
  - Data: `{ timestamp, ip, userAgent, referrer }`  

---

## 📊 Future Enhancements  

- 🔒 Authentication for managing links  
- ⚡ Rate limiting & caching with Redis  
- 🌍 Geo-location analytics (country, city)  
- 📈 Dashboard with charts  

---

## 🤝 Contributing  

1. Fork this repo  
2. Create a new branch (`feature-xyz`)  
3. Commit your changes  
4. Push & create PR 🚀  

---

## 📜 License  

MIT License © 2025 [Your Name]  
