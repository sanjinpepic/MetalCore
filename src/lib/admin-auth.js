/**
 * Utility function to verify admin authentication
 * @param {Request} request - Next.js request object
 * @returns {boolean} - True if authenticated, false otherwise
 */
export function verifyAdminSession(request) {
    const cookie = request.cookies.get('admin_session');

    if (!cookie || cookie.value !== process.env.ADMIN_SESSION_SECRET) {
        return false;
    }

    return true;
}

/**
 * Create an unauthorized response
 * @returns {NextResponse} - 401 response
 */
export function createUnauthorizedResponse() {
    return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
}
