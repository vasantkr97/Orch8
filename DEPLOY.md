# 🚀 Orch8 Deployment Guide

This guide details how to deploy your Orch8 application to a Digital Ocean Droplet using Docker Compose.

## ✅ Prerequisites

1.  **Digital Ocean Account**: [Sign up here](https://m.do.co/c/db7e5e/register) if you don't have one.
2.  **Domain Name (Optional)**: If you want to access your app via a domain (e.g., `app.yourdomain.com`).
3.  **SSH Key**: Ensure you have an SSH key pair for secure access.

---

## 1️⃣ Create a Droplet

1.  Log in to Digital Ocean and create a **Droplet**.
2.  **Choose Image**: Select **Marketplace** -> Search for **"Docker"** -> Select **Docker on Ubuntu**.
    *   *Why?* This image comes with Docker and Docker Compose pre-installed, saving you setup time.
3.  **Choose Plan**: 
    *   For starting out: **Basic Droplet** -> **Regular** -> **$6/mo** (1GB RAM) is the absolute minimum. 
    *   *Recommended*: **$12/mo** (2GB RAM) for better stability with builds.
4.  **Authentication**: Select **SSH Key** and add your public key.
5.  **Create**: Click "Create Droplet".

---

## 2️⃣ Server Setup

1.  **SSH into your Droplet**:
    ```bash
    ssh root@<YOUR_DROPLET_IP>
    ```

2.  **Clone Your Repository**:
    ```bash
    git clone https://github.com/vasantkr97/Orch8.git app
    cd app
    ```
    *(Note: You might need to set up an SSH key on the server to clone from a private repo, or use HTTPS with a Personal Access Token).*

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory:
    ```bash
    nano .env
    ```
    Paste your production variables:
    ```env
    # Database
    POSTGRES_USER=orch8
    POSTGRES_PASSWORD=secure_password_here
    POSTGRES_DB=orch8

    # Backend
    JWT_SECRET=super_secret_jwt_key
    ALLOWED_ORIGINS=http://<YOUR_DROPLET_IP>,http://yourdomain.com
    
    # Frontend (Build time arg, but good to have in env if passed)
    VITE_API_URL=http://<YOUR_DROPLET_IP>/api
    ```
    *Save and exit (Ctrl+O, Enter, Ctrl+X).*

---

## 3️⃣ Deployment

We have included a **`deploy.sh`** script to automate this process.

1.  **Make the script executable**:
    ```bash
    chmod +x deploy.sh
    ```

2.  **Run the deployment**:
    ```bash
    ./deploy.sh
    ```

### What does `deploy.sh` do?
1.  Pulls the latest code from `git`.
2.  Builds the Docker images (using optimized Turbo builds).
3.  Starts the Database and runs **Prisma Migrations**.
4.  Restarts the services.

---

## 4️⃣ Manual Deployment (if script fails)

If you need to run commands manually:

```bash
# 1. Build
docker compose build

# 2. Run Database
docker compose up -d postgres

# 3. Run Migrations
docker compose run --rm backend bunx prisma migrate deploy --schema=./packages/db/prisma/schema.prisma

# 4. Start All
docker compose up -d
```

---

## 5️⃣ Accessing Your App

-   **Frontend**: `http://<YOUR_DROPLET_IP>`
-   **Backend API**: `http://<YOUR_DROPLET_IP>/api/health` (or check logs)

---


---

## 6️⃣ Automated Deployment (CI/CD)

We have included a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) to automatically deploy your app when you push to the `main` branch.

### Setup

1.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Add the following secrets:
    *   `DO_HOST`: The IP address of your Droplet.
    *   `DO_USERNAME`: `root` (or your user).
    *   `DO_PASSWORD`: Your Droplet's root password.

Now, whenever you push code to `main`, GitHub will automatically:
1.  Test and Build your code.
2.  SSH into your server.
3.  Run the deployment script.
