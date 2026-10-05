# SupportAI — CI/CD & AWS Deployment Guide
This guide walks through setting up an automated **GitHub Actions CI/CD pipeline** with **SonarQube code quality & security scanning**, and deploying **SupportAI (Frontend + Backend)** to **Amazon Web Services (AWS)**.

---

## 🏗️ Architecture Overview

```mermaid
flowchart LR
    Dev[Developer git push] --> GH[GitHub Actions]
    
    subgraph CI ["1. Continuous Integration"]
        GH --> Test[Build & Run Tests]
        GH --> Sonar[SonarQube Quality Gate]
    end

    subgraph CD ["2. Continuous Deployment"]
        Sonar -->|Quality Gate Passed| Deploy[Deploy Job via SSH / AWS CLI]
        Deploy --> AWS[AWS EC2 / ECS Instance]
    end

    subgraph Production ["3. Live Production Server"]
        AWS --> Nginx[Nginx Reverse Proxy + SSL]
        Nginx --> Frontend[React + Vite Frontend :5173]
        Nginx --> Backend[Node.js Express Backend :5000]
    end
```

---

## 📑 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [SonarQube / SonarCloud Setup](#2-sonarqube--sonarcloud-setup)
3. [AWS Infrastructure Setup (EC2 + Docker)](#3-aws-infrastructure-setup-ec2--docker)
4. [Dockerization Files](#4-dockerization-files)
5. [GitHub Actions Workflow Configuration](#5-github-actions-workflow-configuration)
6. [Configuring GitHub Repository Secrets](#6-configuring-github-repository-secrets)
7. [SSL / HTTPS Setup with Let's Encrypt](#7-ssl--https-setup-with-lets-encrypt)
8. [Monitoring & Troubleshooting](#8-monitoring--troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:
- A **GitHub Repository** with admin access (`https://github.com/Mukesh0097-pro/Customer-support-Saas`).
- An **AWS Account** with permissions to launch EC2 instances.
- A **SonarCloud Account** (free for public repos at [sonarcloud.io](https://sonarcloud.io)) or a self-hosted **SonarQube Server**.
- A **Domain Name** (optional, but recommended for SSL / HTTPS).

---

## 2. SonarQube / SonarCloud Setup

### Option A: Using SonarCloud (Cloud-hosted, Recommended)
1. Sign in to [sonarcloud.io](https://sonarcloud.io) using your GitHub account.
2. Click **"+" > "Analyze new project"**.
3. Select your repository: `Customer-support-Saas`.
4. Click **Set up** and choose **GitHub Actions**.
5. Note your:
   - **Organization Key** (e.g. `mukesh0097-pro`)
   - **Project Key** (e.g. `mukesh0097-pro_Customer-support-Saas`)
   - **Sonar Token** (`SONAR_TOKEN`) generated in your SonarCloud security settings.

### Option B: Project Configuration File (`sonar-project.properties`)
Create a file named `sonar-project.properties` in your repository root:

```properties
sonar.projectKey=mukesh0097-pro_Customer-support-Saas
sonar.organization=mukesh0097-pro
sonar.projectName=SupportAI SaaS
sonar.sources=project/backend/src,project/frontend/src
sonar.exclusions=**/node_modules/**,**/dist/**,**/public/**
sonar.sourceEncoding=UTF-8
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

---

## 3. AWS Infrastructure Setup (EC2 + Docker)

We will use an **AWS EC2 Ubuntu Instance** running **Docker & Docker Compose** for reliable, isolated container management.

### Step 3.1: Launch EC2 Instance
1. Open the [AWS Management Console](https://console.aws.amazon.com/ec2).
2. Click **Launch Instance**:
   - **Name**: `supportai-production`
   - **AMI**: Ubuntu 22.04 LTS or 24.04 LTS (64-bit x86)
   - **Instance Type**: `t3.small` or `t3.medium` (recommended for Node + Vite build)
   - **Key Pair**: Create or select an existing `.pem` key pair (e.g. `supportai-key.pem`).
   - **Storage**: 20–30 GB gp3 SSD.

### Step 3.2: Configure Security Group
Ensure the following ports are open in **Inbound Rules**:
| Type | Port | Source | Purpose |
| :--- | :--- | :--- | :--- |
| **SSH** | 22 | `My IP` (or `0.0.0.0/0` for CI/CD) | Terminal Access & Deploy |
| **HTTP** | 80 | `0.0.0.0/0` | Web Traffic & SSL Verification |
| **HTTPS** | 443 | `0.0.0.0/0` | Secure SSL Traffic |
| **Custom TCP** | 5000 | `0.0.0.0/0` (Optional if proxied) | Backend API |
| **Custom TCP** | 5173 | `0.0.0.0/0` (Optional if proxied) | Frontend Dev/Preview |

### Step 3.3: Server Initialization Script
SSH into your EC2 instance:
```bash
ssh -i supportai-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Run this command to install Docker, Docker Compose, and Git:
```bash
# Update and install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git

# Allow ubuntu user to run Docker without sudo
sudo usermod -aG docker ubuntu
newgrp docker

# Create application directory
mkdir -p ~/app
cd ~/app
```

---

## 4. Dockerization Files

### 4.1 Backend Dockerfile (`project/backend/Dockerfile`)
```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

### 4.2 Frontend Dockerfile (`project/frontend/Dockerfile`)
```dockerfile
# Build Stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Nginx Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.3 Frontend Nginx Config (`project/frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend container
    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.4 Docker Compose (`docker-compose.yml`)
Place this in the repository root:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./project/backend
      dockerfile: Dockerfile
    restart: always
    env_file:
      - ./project/backend/.env
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production

  frontend:
    build:
      context: ./project/frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 5. GitHub Actions Workflow Configuration

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: SupportAI CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  # -------------------------------------------------------------
  # JOB 1: Code Quality & Security Scan with SonarQube
  # -------------------------------------------------------------
  code-quality:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for SonarQube analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: project/frontend/package-lock.json

      - name: Install Frontend Dependencies
        run: |
          cd project/frontend
          npm ci

      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL || 'https://sonarcloud.io' }}

  # -------------------------------------------------------------
  # JOB 2: Build & Validate Frontend and Backend
  # -------------------------------------------------------------
  build-and-test:
    name: Build & Test
    needs: code-quality
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Test Backend Build
        run: |
          cd project/backend
          npm ci

      - name: Build Frontend Production Bundle
        run: |
          cd project/frontend
          npm ci
          npm run build

  # -------------------------------------------------------------
  # JOB 3: Continuous Deployment to AWS EC2
  # -------------------------------------------------------------
  deploy:
    name: Deploy to AWS EC2
    needs: [code-quality, build-and-test]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy on AWS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.AWS_EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.AWS_SSH_PRIVATE_KEY }}
          script: |
            set -e
            echo "🚀 Starting Deployment on AWS EC2..."
            
            # Navigate to project or clone if not present
            if [ ! -d "$HOME/app/.git" ]; then
              git clone https://github.com/${{ github.repository }}.git $HOME/app
            fi

            cd $HOME/app
            git fetch origin main
            git reset --hard origin/main

            # Inject Production Environment Variables
            cat <<EOF > project/backend/.env
            PORT=5000
            NODE_ENV=production
            JWT_SECRET=${{ secrets.PROD_JWT_SECRET }}
            JWT_EXPIRES_IN=7d
            GOOGLE_CLIENT_ID=${{ secrets.PROD_GOOGLE_CLIENT_ID }}
            GOOGLE_CLIENT_SECRET=${{ secrets.PROD_GOOGLE_CLIENT_SECRET }}
            GOOGLE_CALLBACK_URL=http://${{ secrets.AWS_EC2_HOST }}/api/auth/google/callback
            CLIENT_URL=http://${{ secrets.AWS_EC2_HOST }}
            EOF

            cat <<EOF > project/frontend/.env
            VITE_API_URL=http://${{ secrets.AWS_EC2_HOST }}/api
            EOF

            # Build and Restart Docker Containers
            docker compose down || true
            docker compose up -d --build

            echo "✅ Deployment completed successfully!"
```

---

## 6. Configuring GitHub Repository Secrets

Go to your GitHub repo: **Settings > Secrets and variables > Actions > New repository secret**.

Add the following secrets:

| Secret Name | Description | Example / Source |
| :--- | :--- | :--- |
| `SONAR_TOKEN` | Authentication token generated in SonarCloud/SonarQube | `sqp_8a92...` |
| `SONAR_HOST_URL` | Sonar URL (optional if using SonarCloud) | `https://sonarcloud.io` |
| `AWS_EC2_HOST` | Public IP or DNS of your AWS EC2 instance | `54.210.82.14` |
| `AWS_SSH_PRIVATE_KEY` | Contents of your downloaded `.pem` key file | `-----BEGIN RSA PRIVATE KEY-----...` |
| `PROD_JWT_SECRET` | Strong random secret for production JWT tokens | `b4a92c019481f9a2b8...` |
| `PROD_GOOGLE_CLIENT_ID` | Production Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `PROD_GOOGLE_CLIENT_SECRET` | Production Google OAuth Client Secret | `GOCSPX-xxx` |

---

## 7. SSL / HTTPS Setup with Let's Encrypt

When pointing your custom domain (e.g. `support.yourcompany.com`) to your EC2 Public IP:

```bash
# Install Certbot on EC2
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL Certificate
sudo certbot --nginx -d support.yourcompany.com

# Test automatic renewal
sudo certbot renew --dry-run
```

Update your `GOOGLE_CALLBACK_URL` and `CLIENT_URL` to use `https://support.yourcompany.com` in Google Cloud Console credentials and in GitHub Secrets.

---

## 8. Monitoring & Troubleshooting

### View Container Logs
```bash
# In ~/app directory on EC2:
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart Services
```bash
docker compose restart
```

### Inspect Health Check
```bash
curl http://localhost/api/health
# Output: {"status":"ok"}
```

---

## 🎯 Verification Checklist
- [ ] Push to `main` branch triggers the GitHub Action.
- [ ] SonarQube quality gate passes with 0 security vulnerabilities.
- [ ] Docker builds frontend into production static files served by Nginx.
- [ ] Backend runs on Node 20 alpine with production cookies.
- [ ] The chatbot widget is accessible live at `http://<YOUR_IP_OR_DOMAIN>/widget.js`.
- [ ] Customer chats in the widget route directly to the Live Inbox.
