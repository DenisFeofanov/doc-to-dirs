# Doc to Dirs

Create particular directory structure for uploaded files

## Development

1. Install project dependencies for development

   ```bash
   cd /doc-to/dirs
   npm i
   ```

2. Run the app

   ```bash
   docker compose -f compose.core.yaml -f compose.dev.yaml up --watch
   ```

   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

3. Edit the code. Changes will be synced with docker automatically

4. Stop the app

   ```bash
   docker compose -p doc-to-dirs down
   ```

## Deployment

1. Run the app

   ```bash
   docker compose -f compose.core.yaml -f compose.prod.yaml up -d
   ```

   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

2. Stop the app

   ```bash
   docker compose -p doc-to-dirs down
   ```
