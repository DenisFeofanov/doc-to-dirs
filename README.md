# Doc to Dirs

Create particular directory structure for uploaded files

## Quick Start

1. Run the application

   - Development

   ```bash
   docker compose -f compose.core.yaml -f compose.dev.yaml up --watch
   ```

   - Production

   ```bash
   docker compose -f compose.core.yaml -f compose.prod.yaml up -d
   ```

2. Access the services

   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

3. Stop the application

   ```bash
   docker compose -p doc-to-dirs down
   ```
