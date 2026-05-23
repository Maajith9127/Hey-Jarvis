# Hey-Jarvis

<p align="center">
  <img src="https://img.shields.io/badge/status-archived-orange" alt="Status: Archived" />
  <img src="https://img.shields.io/badge/deployment-AWS%20EC2-blue" alt="Deployment: AWS EC2" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

<p align="center">
  <b>The ambitious, web-based accountability prototype with real stakes.</b><br />
  This repository contains the predecessor to <a href="https://github.com/Maajith9127/CommitT">CommitT (Android version)</a>, built in early 2025 to test strict behavioral enforcement.
</p>

---

## 📖 The Origin Story (The "Ugly" Predecessor)

Before the native Android version of **CommitT** existed, there was **Hey-Jarvis**. 

In early 2025, I wanted to build an accountability system that didn't rely on willpower. The concept was simple: commit to your goals, and if you fail to prove you did them, you pay a real monetary penalty or face embarrassing consequences.

### Why was it "Ugly" & Limited?
While **Hey-Jarvis** was packed with complex features (payments, background workers, and even AI verification), it was built entirely as a **web application**. This came with fundamental limitations:
- **Sandbox Restrictions:** As a web app, it couldn't perform deep system-level app blocking or disable access to the phone's settings.
- **Easy Bypass:** Users could simply close the tab, turn off their internet connection, or delete browser data to escape a session.
- **Background Limitations:** It was impossible to keep a robust background service running in the browser to track locations or send immediate push alerts.

These limitations eventually led to the birth of **CommitT** — a hardcore, native Android app utilizing Accessibility Services and device-level locking. However, **Hey-Jarvis** remains the project where the core protocols, databases, and background scheduling systems were originally engineered.

---

## 🚀 Core Features

- **📅 Timeline & Calendar:** A drag-and-drop timeline using React and FullCalendar to schedule daily commitments and track active tasks in real-time.
- **💳 Stakes & Cashfree Integration:** Integrated with the **Cashfree Payment Gateway API** to authorize and execute real money penalties if you fail to complete your commitments.
- **📸 Live Photo Verification (Anti-Cheat):** Captures live camera feeds via the browser. To prevent users from simply holding up a phone or screen showing an old photo, it runs a **Python-based Moire pattern check** to score and detect screen glare/pixels.
- **🎲 Randomized Check-Ins:** Background queues that schedule unexpected check-in intervals, forcing the user to take a webcam photo and check in within minutes to prove presence.
- **🔒 Strict Mode Filter:** Middleware enforcement that locks active commitment states in the database, preventing any API-level modification or deletion mid-session.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **State Management:** Redux Toolkit
- **Styling:** TailwindCSS v4
- **Interactive UI:** FullCalendar React suite, React Webcam, Lucide Icons

### Backend
- **Core:** Node.js, Express (ES Modules)
- **Database:** MongoDB (via Mongoose)
- **Caching & Queues:** Redis (via BullMQ and ioredis) for background worker job scheduling
- **Process Manager:** PM2 (running API and worker processes in isolation)
- **Security:** bcrypt, JSON Web Tokens, cookie-parser, custom CORS configurations
- **Notifications:** Nodemailer for automated email notifications (crash alerts, penalty notices, reminders)

---

## 🌐 Infrastructure & Deployment

This project was built to run in production and was fully deployed on AWS:

- **Compute:** Hosted on an **AWS EC2** instance (Ubuntu).
- **Web Server:** Nginx acting as a reverse proxy, serving the compiled React frontend from `/usr/share/nginx/html` and routing API traffic to the backend.
- **Background Jobs:** PM2 managing the Express API server and the BullMQ background worker (`accountabilityWorker.js`) independently.
- **CI/CD:** Automated pipeline via GitHub Actions workflows (`deploy-backend.yml` and `deploy.yml`) executing build steps, SCP file transfers, and Nginx/PM2 restarts on push.

---

## 📂 Project Structure

```
Hey-Jarvis/
├── Jarvis-BackEnd/
│   └── Hey-Jarvis-BackEnd/
│       ├── controllers/           # Auth, payments, strict-mode & calendar endpoints
│       ├── models/                # MongoDB (Mongoose) schemas (User, Payout, Penalty, Photo)
│       ├── routes/                # Express API router definitions
│       ├── scripts/               # Deploy scripts & Python Moire checker
│       ├── utils/
│       │   ├── ScheduleComponents/# BullMQ worker, queue setups & scheduler chains
│       │   └── Penalties/         # Penalty triggers and notification drivers
│       └── index.js               # Entry point of the Express API server
│
├── Jarvis-FrontEnd/
│   └── Hey-Jarvis-FrontEnd/
│       └── jarvis-frontend/
│           ├── src/
│           │   ├── Components/    # Modals, Policies, Accountability & ToDos UI
│           │   ├── ReduxToolkit/  # Slices and Global Store
│           │   ├── hooks/         # Custom React hooks (sockets, drag & drop, maps)
│           │   └── main.jsx       # App entry point
│           ├── index.html
│           └── vite.config.js
```

---

## 📸 Screenshots

Here is the "before" look of my initial web prototype compared to the native Android transition:

### Web Prototype Dashboard (Hey-Jarvis)
*Add your web interface screenshots here:*
<!-- Place screenshots/gifs here -->
![Web Dashboard](Jarvis-BackEnd/photo-1570829460005-c840387bb1ca.jpg)

### Native Android Successor (CommitT)
*Check out the Android counterpart:* [CommitT Repository](https://github.com/Maajith9127/CommitT)

---

## 📄 License

This project is licensed under the MIT License.
