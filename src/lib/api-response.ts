/**
 * Standardised API response helpers.
 * ALL API routes must use these — keeps the response shape consistent
 * so the frontend never has to guess the structure.
 */

export function apiSuccess<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, details?: unknown) {
  return Response.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  )
}

export function apiUnauthorized(message = 'Unauthorised') {
  return apiError(message, 401)
}

export function apiForbidden(message = 'Forbidden') {
  return apiError(message, 403)
}

export function apiNotFound(message = 'Not found') {
  return apiError(message, 404)
}

export function apiTooManyRequests(message = 'Too many requests') {
  return apiError(message, 429)
}

export function apiServerError(message = 'Internal server error') {
  return apiError(message, 500)
}
