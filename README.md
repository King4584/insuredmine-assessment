# InsuredMine Node.js Technical Assessment

This repository contains the backend solution for the InsuredMine Node.js Developer assessment. It is a robust, scalable REST API built with Express.js and MongoDB that handles asynchronous CSV processing via worker threads, aggregates complex data, and manages scheduled background tasks.

## 🚀 Features & Functionality

### Task 1: Data Processing & Aggregation
* **Worker Thread CSV Upload:** Parses large CSV files off the main event loop using Node.js `worker_threads`, preventing server blocking.
* **Data Normalization:** Automatically maps flat CSV data into 6 relational MongoDB collections (`Agents`, `Users`, `Accounts`, `LOBs`, `Carriers`, and `Policies`).
* **Search API:** Fast, case-insensitive querying to find policy information associated with a specific user.
* **Aggregation API:** Leverages MongoDB's aggregation pipeline (`$group`, `$lookup`, `$unwind`) to compile and group total policies per user.

### Task 2: System Optimization & Task Scheduling
* **CPU Monitoring:** A background utility utilizing `os-utils` that tracks real-time CPU utilization. If usage spikes to 70%, the server gracefully exits (triggering a restart via PM2/Nodemon) to prevent system hangs.
* **Scheduled Task API:** Utilizes `node-schedule` to accept a message and a future timestamp, holding it in memory, and automatically inserting it into the database precisely at the scheduled date and time.

## 🛠 Prerequisites

Before running this project, ensure you have the following installed on your machine:
* Node.js (v16.x or higher)
* MongoDB (Running locally via MongoDB Compass, or a cloud Atlas cluster)
* Postman (For API testing)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/King4584/insuredmine-assessment.git
cd insuredmine-assessment
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project and add the following variables:

```env
PORT=5000
# Use this for a local MongoDB instance:
MONGO_URI=mongodb://127.0.0.1:27017/insuredmine_db
# OR paste your MongoDB Atlas connection string here.
```

### 4. Start the Application

To start the backend:
```bash
nodemon server.js
```

You should see a console message confirming the server is running on port 5000 and MongoDB is connected successfully.

## 📡 API Endpoints & Testing Guide

A Postman collection is included in this repository. You can import it directly into Postman, or use the manual configurations below to test the endpoints.

### 1. Upload CSV Data
Uploads and processes the provided `data-sheet.csv` file using a background worker thread.

* **URL:** `POST /api/upload`
* **Body (`form-data`):**
  * Key: `file` (Change type to **File**)
  * Value: Select the `data-sheet.csv` file from your local machine.
* **Expected Response (200 OK):**
```json
{
  "status": "success",
  "count": 1198
}
```

### 2. Search Policy by Username
Retrieves all policy and carrier data associated with a specific user's first name.

* **URL:** `GET /api/search?username=Lura`
* **Query Params:** `username` (e.g., `Lura`)
* **Expected Response (200 OK):** Returns an array of populated policy objects linked to that user.

### 3. Aggregate Policies
Groups and aggregates the total number of policies and their respective numbers for every user in the database.

* **URL:** `GET /api/aggregate`
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 1198,
  "data": [
    {
      "totalPolicies": 1,
      "policies": ["YEEX9MOIBU7X"],
      "userName": "Lura Lucca",
      "email": "madler@yahoo.ca"
    }
  ]
}
```

### 4. Schedule a Message
Schedules a message to be automatically inserted into the `scheduledmessages` MongoDB collection at a specific future date and time.

* **URL:** `POST /api/schedule`
* **Body (`application/json`):**
```json
{
  "message": "Hello InsuredMine Team",
  "day": "2026-08-25",
  "time": "15:30:00"
}
```

> **Testing Note:** Set the `day` to today's date and the `time` to exactly 1 minute in the future. Wait 1 minute, then check the `scheduledmessages` collection in your MongoDB database to verify the insertion.

## 🗂 Folder Structure

```plaintext
insuredmine-assessment/
│
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── policyController.js   # Logic for upload, search, and aggregate APIs
│   └── taskController.js     # Logic for the scheduled message API
├── models/                   # Mongoose Schemas
│   ├── Agent.js
│   ├── Carrier.js
│   ├── LOB.js
│   ├── Policy.js
│   ├── ScheduledMessage.js
│   ├── User.js
│   └── UserAccount.js
├── routes/
│   └── api.js                # Express routing definitions
├── utils/
│   └── cpuMonitor.js         # Background CPU tracker (Task 2.1)
├── workers/
│   └── uploadWorker.js       # Background thread for CSV processing
├── uploads/                  # Temporary storage for incoming CSV files
├── .env                      # Environment variables (not tracked in Git)
├── package.json              
├── server.js                 # Application entry point
└── README.md
```