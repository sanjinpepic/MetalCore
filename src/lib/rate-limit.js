/**
 * Simple in-memory rate limiter for API routes
 * For production with multiple instances, consider using Redis or Upstash
 */

const rateLimitMap = new Map();

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
    AUTH: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
    ADMIN_API: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 requests per minute
    PUBLIC_API: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
    AI_FEATURES: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
};

/**
 * Check if a request should be rate limited
 * @param {string} identifier - Unique identifier (IP address, user ID, etc.)
 * @param {Object} config - Rate limit configuration
 * @param {number} config.maxRequests - Maximum number of requests allowed
 * @param {number} config.windowMs - Time window in milliseconds
 * @returns {Object} - { limited: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(identifier, config) {
    const now = Date.now();
    const key = `${identifier}`;

    // Get or create rate limit entry
    let entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        // Create new entry or reset expired entry
        entry = {
            count: 0,
            resetTime: now + config.windowMs,
        };
        rateLimitMap.set(key, entry);
    }

    // Increment request count
    entry.count++;

    // Check if limit exceeded
    const limited = entry.count > config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    return {
        limited,
        remaining,
        resetTime: entry.resetTime,
    };
}

/**
 * Get client identifier from request (IP address)
 * @param {Request} request - Next.js request object
 * @returns {string} - Client identifier
 */
export function getClientIdentifier(request) {
    // Try to get real IP from headers (for proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a default identifier
    return 'unknown';
}

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}
