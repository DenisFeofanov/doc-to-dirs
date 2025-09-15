# API Documentation

## Overview

This API has been restructured following best practices for scalability and maintainability. The architecture follows a modular MVC pattern with clear separation of concerns.

## Architecture

### Directory Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request/response handlers
├── middleware/       # Reusable middleware functions
├── routes/          # Route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions
├── index.js         # Main server file
└── logger.js        # Logging configuration
```

### Key Features

- **Modular Architecture**: Clear separation between routes, controllers, services, and middleware
- **Environment Configuration**: Centralized config management
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Logging**: Structured logging with request/response tracking
- **File Upload**: Robust file handling with validation and cleanup
- **Backward Compatibility**: Graceful migration from old endpoints

## API Endpoints

### Base URL

All endpoints are prefixed with `/api`

### Health Endpoints

- `GET /api/health` - Comprehensive health check
- `GET /api/health/status` - Simple status check

### Upload Endpoints

- `POST /api/uploads` - Upload files
- `GET /api/uploads/:uploadId` - Get upload information
- `DELETE /api/uploads/:uploadId` - Delete upload

## Upload Endpoint Details

### POST /api/uploads

Upload files with the following multipart form fields:

#### Required Fields

- `reportFile`: Single .xls file
- `layoutFile`: Single .dxf or .dwg file

#### Optional Fields

- `otherFiles`: Multiple files of any type (max 50 files)

#### Response Format

```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": {
    "uploadId": "uuid-string"
  },
  "timestamp": "2025-09-15T10:30:00.000Z"
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400,
  "timestamp": "2025-09-15T10:30:00.000Z"
}
```

### GET /api/uploads/:uploadId

Retrieve information about an uploaded file set.

#### Response Format

```json
{
  "success": true,
  "message": "Upload information retrieved",
  "data": {
    "uploadId": "uuid-string",
    "directory": "/path/to/upload/directory",
    "files": [
      {
        "name": "filename.ext",
        "size": 1024,
        "created": "2025-09-15T10:30:00.000Z",
        "modified": "2025-09-15T10:30:00.000Z"
      }
    ],
    "totalFiles": 3
  },
  "timestamp": "2025-09-15T10:30:00.000Z"
}
```

### DELETE /api/uploads/:uploadId

Delete an upload and all associated files.

#### Response Format

```json
{
  "success": true,
  "message": "Upload deleted successfully",
  "data": {
    "uploadId": "uuid-string"
  },
  "timestamp": "2025-09-15T10:30:00.000Z"
}
```

## Configuration

The application supports environment-based configuration through the `src/config/index.js` file:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)
- `CORS_ORIGIN`: CORS origin setting

## Error Handling

The API uses standardized error responses with appropriate HTTP status codes:

- `400`: Bad Request (validation errors, missing files)
- `404`: Not Found (upload not found, invalid routes)
- `410`: Gone (deprecated endpoints)
- `500`: Internal Server Error

## Migration from Old Endpoints

### Deprecated Endpoints

- `POST /upload` → `POST /api/uploads` (returns 410 Gone with migration info)
- `GET /status` → `GET /api/health/status` (redirects with 301)

### Breaking Changes

1. Response format changed to standardized success/error format
2. Upload endpoint moved to `/api/uploads`
3. Response includes additional metadata (timestamp, success flag)

## Development

The architecture supports easy extension:

1. Add new routes in `src/routes/`
2. Create controllers in `src/controllers/`
3. Implement business logic in `src/services/`
4. Add reusable middleware in `src/middleware/`
5. Update configuration in `src/config/`
