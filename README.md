<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MediConnect BD

This project contains the frontend and backend for the MediConnect BD application.

## Prerequisites

-   **Node.js**: Make sure you have Node.js installed (v18 or higher recommended).
-   **MySQL**: A running MySQL database instance.

## Getting Started

Follow these steps to get your development environment running.

### 1. Create the Database

First, you need to create the database for the application.

1.  Open your MySQL command-line client or a GUI tool like MySQL Workbench.
2.  Enter the root password you created during installation.
3.  Run the following command to create the database:
    ```sql
    CREATE DATABASE mediconnect;
    ```

### 2. Backend Setup

Next, set up and run the backend server.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file by copying the example file.
    ```bash
    cp .env.example .env
    ```
    Now, open the `backend/.env` file and fill in your MySQL database password and the `DB_PORT` you chose during installation (e.g., 3307).

4.  **Run the backend development server:**
    ```bash
    npm run dev
    ```
    The backend server should now be running. You will see a "MySQL Connected..." message if successful.

### 3. Frontend Setup

With the backend running, open a **new terminal** and set up the frontend.

1.  **Navigate to the project root directory** (if you are in the `backend` folder, go back one level).
    ```bash
    cd ..
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables (Optional):**
    If you plan to use the Gemini AI features, create a `.env` file in the root directory.
    ```bash
    touch .env
    ```
    Add your Gemini API key to this file. **Remember to prefix it with `VITE_`** for it to be accessible in the frontend code.
    ```
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    Your React application should now be running and accessible in your web browser.
