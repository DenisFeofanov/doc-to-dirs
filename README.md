# Doc to Dirs

Create particular directory structure for uploaded files

## Quick Start

1. **Run the application**

   ```bash
   docker compose up -d
   ```

2. **Access the services**

   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

3. **Stop the application**
   ```bash
   docker compose down
   ```

## Reading Logs

The backend uses Winston for structured JSON logging.

```bash
# View all logs
docker compose logs backend

# Pretty-print JSON logs with jq
docker compose logs --no-log-prefix backend | jq -Rr 'fromjson? | .'
```
