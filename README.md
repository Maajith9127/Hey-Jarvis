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

## The Origin Story (The "Ugly" Predecessor)

Before the native Android version of CommitT existed, there was Hey-Jarvis. 

In early 2025, I wanted to build an accountability system that didn't rely on willpower. The concept was simple: commit to your goals, and if you fail to prove you did them, you pay a real monetary penalty or face embarrassing consequences.

### Why was it "Ugly" and Limited?
While Hey-Jarvis was packed with complex features (payments, background workers, and even AI verification), it was built entirely as a web application. This came with fundamental limitations:
- **Sandbox Restrictions:** As a web app, it couldn't perform deep system-level app blocking or disable access to the phone's settings.
- **Easy Bypass:** Users could simply close the tab, turn off their internet connection, or delete browser data to escape a session.
- **Background Limitations:** It was impossible to keep a robust background service running in the browser to track locations or send immediate push alerts.

These limitations eventually led to the birth of CommitT — a hardcore, native Android app utilizing Accessibility Services and device-level locking. However, Hey-Jarvis remains the project where the core protocols, databases, and background scheduling systems were originally engineered.

---

## Core Features

- **Timeline and Calendar:** A drag-and-drop timeline using React and FullCalendar to schedule daily commitments and track active tasks in real-time.
- **Stakes and Cashfree Integration:** Integrated with the Cashfree Payment Gateway API to authorize and execute real money penalties if you fail to complete your commitments.
- **Live Photo Verification (Anti-Cheat):** Captures live camera feeds via the browser. To prevent users from simply holding up a phone or screen showing an old photo, it runs a Python-based Moire pattern check to score and detect screen glare/pixels.
- **Randomized Check-Ins:** Background queues that schedule unexpected check-in intervals, forcing the user to take a webcam photo and check in within minutes to prove presence.
- **Strict Mode Filter:** Middleware enforcement that locks active commitment states in the database, preventing any API-level modification or deletion mid-session.

---

## Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **State Management:** Redux Toolkit
- **Styling:** TailwindCSS v4
- **Interactive UI:** FullCalendar React suite, React Webcam, Lucide Icons

### Backend
- **Core:** Node.js, Express (ES Modules)
- **Database:** MongoDB (via Mongoose)
- **Caching and Queues:** Redis (via BullMQ and ioredis) for background worker job scheduling
- **Process Manager:** PM2 (running API and worker processes in isolation)
- **Security:** bcrypt, JSON Web Tokens, cookie-parser, custom CORS configurations
- **Notifications:** Nodemailer for automated email notifications (crash alerts, penalty notices, reminders)

---

## Infrastructure and Deployment

This project was built to run in production and was fully deployed on AWS:

- **Compute:** Hosted on an AWS EC2 instance (Ubuntu).
- **Web Server:** Nginx acting as a reverse proxy, serving the compiled React frontend from /usr/share/nginx/html and routing API traffic to the backend.
- **Background Jobs:** PM2 managing the Express API server and the BullMQ background worker (accountabilityWorker.js) independently.
- **CI/CD:** Automated pipeline via GitHub Actions workflows (deploy-backend.yml and deploy.yml) executing build steps, SCP file transfers, and Nginx/PM2 restarts on push.

---

## Project Structure

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

## Screenshots & Workflow Walkthrough

Here is the user interface of the Hey-Jarvis web prototype, illustrating the core accountability workflow:

### 1. Dashboard Overview
The main interface features a drag-and-drop calendar/timeline where users schedule their commitments, side-by-side with configuration panels for penalties and task templates.

![Dashboard Overview](screenshots/{5A970AEA-1AAD-475A-9D33-8E2C53517092}.png)

### 2. Live Photo Task Templates
Create specific tasks that require photo verification (e.g., Gym, Library). You click the live photo button, add your reference verification photos, and name the task category.

![Live Photo Task Templates](screenshots/{26E224A0-6EA3-4E31-8E80-92AC717FD9D6}.png)

### 3. Consequence and Penalty Configuration
Configure the stakes on the right-hand panel. You can set a monetary penalty or define "cringe consequences" (e.g., sending an embarrassing message, playing a specific video, etc.) to trigger upon failure.

![Consequence Setup](screenshots/{9AF37AE7-D877-4C48-A70A-8E7589A542EC}.png)

### 4. Interactive Calendar Scheduling & Verification Windows
- **Drag-and-Drop Events:** Drag a blue task event (e.g., "Gym") from your templates onto the calendar to schedule it (e.g., 6:00 AM - 7:00 AM).
- **Overlapping Penalties:** Drag a red penalty block from the right-hand panel and overlap it onto the blue calendar event.
- **Strict Verification Window:** The overlapping region determines your window of verification. For example, if you schedule the gym from 6:00 AM to 7:00 AM but the penalty overlaps from 6:00 AM to 6:10 AM, you **must** submit verification within that specific 10-minute slot, or the penalty is automatically executed. The same logic applies to randomized check-ins.

![Calendar and Overlapping Penalty Logic](screenshots/{36502878-61D7-4ED1-9131-B6634D82C7D7}.png)

---

### Native Android Successor (CommitT)
*Check out the Android counterpart:* [CommitT Repository](https://github.com/Maajith9127/CommitT)

---

## License

This project is licensed under the MIT License.
