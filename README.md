# 📦 Dockerized MongoDB Sentinel

A robust, production-ready MongoDB deployment utilizing Docker Compose, featuring persistent storage and root authentication.

## 🚀 Quick Start

### 1. Deployment
Navigate to the project directory and spin up the container:
```bash
cd ~/dockerized-mongodb
docker compose up -d
```

### 2. Connection Details
- **Host**: `localhost` (from host machine) or `mongodb_service` (within Docker network)
- **Port**: `27017`
- **Username**: `admin`
- **Password**: `VaultTecSecurePass123`
- **Recommended Connection String**:
  `mongodb://admin:VaultTecSecurePass123@localhost:27017/?retryWrites=false`

---

## 🛠 Operations Guide

### Accessing MongoDB Inside the Container
To enter the database shell directly from your terminal:
```bash
docker exec -it mongodb_service mongosh -u admin -p VaultTecSecurePass123
```

### Testing the Connection
Once inside the shell, run the following command to verify the database is responsive:
```javascript
db.adminCommand('ping')
```
*Expected result: `{ ok: 1 }`*

### Data Persistence
Data is stored in a named Docker volume `dockerized-mongodb_mongo_data`. This ensures that:
- **Restarting the container** does NOT delete data.
- **Stopping the container** does NOT delete data.
- **Updating the image** does NOT delete data.

To completely wipe the database and start fresh:
```bash
docker compose down -v
```

---

## 🔍 Debugging & Troubleshooting

### Checking Logs
If the container fails to start or behaves unexpectedly, inspect the logs:
```bash
docker compose logs mongodb
```

### Monitoring Resource Usage
Check CPU and Memory consumption in real-time:
```bash
docker stats mongodb_service
```

### Common Issues
- **Authentication Failed**: Ensure you are using the credentials defined in `docker-compose.yml`. Note: Credentials only take effect during the *initial* volume creation.
- **Port Collision**: If port `27017` is already in use, change the left side of the `ports` mapping in `docker-compose.yml` (e.g., `"27018:27017"`).
- **Retryable Writes Error**: If your application complains about `retryWrites`, ensure you have appended `?retryWrites=false` to your connection string.

---
*Project maintained by PIP-BOY (Vault-Tec Personal Monitoring Unit).*
