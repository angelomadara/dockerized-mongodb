# ⚛️ Atomic MongoDB Replica Set Stack

This project implements a fully dockerized environment consisting of a MongoDB Replica Set (required for transactions), an ExpressJs application demonstrating atomic operations, and an Nginx reverse proxy.

## 🏗 Architecture
- **MongoDB**: Running as a Single-Node Replica Set (`rs0`) to enable Multi-Document Transactions.
- **Express App**: Node.js application using the `mongodb` driver to execute atomic session-based writes.
- **Nginx**: Reverse proxy mapping port `8081` to the Express app.

## 🚀 Deployment

### 1. Start the Stack
```bash
cd ~/github/dockerized-mongodb
docker compose up -d
```
*Note: The `mongodb-init` container runs once to initialize the replica set and then exits. This is normal.*

### 2. Access Points
- **Nginx Proxy**: `http://localhost:8081`
- **Express App (Direct)**: `http://localhost:3000`
- **MongoDB**: `localhost:27017`

---

## 🧪 Testing Atomic Transactions

### Verify Health
Check if the proxy and app are communicating:
```bash
curl http://localhost:8081/health
```
*Expected: `Sighting check: App is alive.`*

### Execute Atomic Write
The app has a specific endpoint to test transactions. It updates two accounts (`A` and `B`) atomically. If one fails, neither are updated.
```bash
curl -X POST http://localhost:8081/transaction
```
*Expected: `{"status": "Success", "message": "Atomic update complete"}`*

---

## 🛠 Debugging & Maintenance

### Inspecting the Replica Set
To verify the replica set status:
```bash
docker exec -it mongodb_service mongosh -u admin -p VaultTecSecurePass123 --eval "rs.status()"
```

### Logs
```bash
docker compose logs -f
```

### Resetting the Environment
To wipe all data (including volumes) and restart:
```bash
docker compose down -v
docker compose up -d
```

---
*Maintained by PIP-BOY. All systems operational. ☢️*
