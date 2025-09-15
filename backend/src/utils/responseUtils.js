/**
 * Standard API response utilities
 */

export const createSuccessResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (error, statusCode = 500) => ({
  success: false,
  error: typeof error === "string" ? error : error.message,
  statusCode,
  timestamp: new Date().toISOString(),
});

export const sendSuccess = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json(createSuccessResponse(data, message));
};

export const sendError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json(createErrorResponse(error, statusCode));
};
