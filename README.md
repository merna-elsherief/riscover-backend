# 🛡️ Riscover GRC - Backend (MVP)

A modern Governance, Risk, and Compliance (GRC) platform backend built with **NestJS**.
This MVP focuses on the **Risk Management Module**, featuring complex workflows, role-based access control (RBAC), and automated risk scoring.

## 🚀 Key Features

### 1. Risk Management Core
- **Auto-Increment IDs:** Risks are automatically assigned human-readable IDs (e.g., `RISK-001`).
- **Scoring Engine:** Automated calculation of **Inherent Risk** & **Residual Risk** scores based on Likelihood × Impact.
- **Visual Ratings:** Automatic categorization (Low, Medium, High, Critical).

### 2. Workflow & RBAC
- **Segregation of Duties:**
  - **Risk Owners** can create and mitigate risks.
  - Only **BU Heads** (Business Unit Heads) can `Accept` risks.
  - **Cross-Department Protection:** Managers can only approve risks within their own departments.

### 3. Mitigation & Controls
- **Controls Library:** A repository of standard controls (ISO, NIST, etc.).
- **Risk Treatment:** Ability to link controls to risks to calculate residual scores.

### 4. Audit Trail & Timeline
- **Full History:** Every action (Create, Status Change, Comment) is logged in the risk's timeline.
- **Traceability:** Logs include *Who*, *When*, and *What* changed.

---

## 🛠️ Tech Stack
- **Framework:** NestJS (Node.js)
- **Database:** MongoDB (via Mongoose)
- **Language:** TypeScript
- **Authentication:** JWT (JSON Web Tokens)
- **Documentation:** Swagger (OpenAPI)
- **Validation:** Class-Validator & Class-Transformer

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd riscover-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/riscover-db
   JWT_SECRET=super_secret_key_change_in_production
   ```

---

## 🌱 Database Seeding (Important!)

This project includes a seeding script to populate the database with **Roles**, **Users**, **Controls**, and **Initial Risks**.

Run this command once before starting the app:

```bash
npx ts-node src/seed.ts
```

> **Note:** This will create users like Admin, BU Heads (IT/HR), and Risk Owners. It will also populate standard controls (ISO/NIST).

---

## ▶️ Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The server will start at `http://localhost:3000`.

---

## 📚 API Documentation

Swagger UI is available for testing API endpoints interactively.

1. Start the server.
2. Go to: **[http://localhost:3000/api](http://localhost:3000/api)**
3. Click **Authorize** and enter the JWT Token (obtained from `/auth/login`).

---

## 🧪 Testing Credentials (from Seed)

Use these credentials to test different roles and workflows in Postman or Swagger:

| Role | Username | Email | Password | Department | Capability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Risk Owner** | `ali_it` | `ali@riscover.com` | `123` | IT | Create Risks, Mitigate |
| **BU Head (IT)** | `hassan_head` | `hassan@riscover.com` | `123` | IT | **Approve** IT Risks |
| **BU Head (HR)** | `mona_hr` | `mona@riscover.com` | `123` | HR | Cannot approve IT Risks |
| **Admin** | `admin` | `admin@riscover.com` | `123` | Mgt | Full Access |

---

## 📂 Project Structure

```bash
src/
├── auth/           # Login & JWT Strategy
├── users/          # User management & Profiles
├── risks/          # Core Risk Logic (Workflow, Scoring, Timeline)
├── controls/       # Controls Library (ISO/NIST)
├── common/         # Shared utilities (Auto-increment Counter)
├── seed.ts         # Database Seeding Script
└── main.ts         # App Entry Point & Global Pipes
```

---

## 📝 Example Workflow to Test

1. **Login** as `ali_it` (Risk Owner) -> Get Token.
2. **Create Risk** via `POST /risks`. Note the `siNo` (e.g., RISK-001).
3. **Login** as `mona_hr` (HR Manager).
4. **Try to Accept** RISK-001 via `PATCH /risks/{id}/status`.
   - *Result:* `403 Forbidden` (Wrong Department).
5. **Login** as `hassan_head` (IT Manager).
6. **Accept Risk** via `PATCH /risks/{id}/status`.
   - *Result:* `200 OK`.
7. **Check Timeline** via `GET /risks/{id}` to see the full history.
