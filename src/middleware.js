import { NextResponse } from 'next/server';
import { verifyToken, verifyTokenInite } from '@/lib/jwt';

const publicPaths = [
    '/',
    '/join',
    '/login',
    '/signup',
    '/invited',
    '/invited/subcontractor',
    '/admin/login',
    '/api/doc',
    '/api/contractor/join',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/admin/login',
    '/favicon.ico',
    '/logo.svg',
    '/sitemap.xml',
    '/api/sub-companies/all',
    '/api/sub-companies/activities',
    '/api/sub-companies/activities/subactivities',
    '/api/support',
    '/documents/*'
];

const adminOnlyPaths = [
    '/api/companies'
];

const subContractorOnlyPaths = [
    // '/user/qr'
];
const ContractorOnlyPaths = [
    '/industrials',
];

const supervisorOnlyPaths = [
    '/user/qr',
];

export async function middleware(request) {
    try {

        const { pathname } = request.nextUrl;

        if (pathname.startsWith('/_next')) {
            return NextResponse.next();
        }

        if (publicPaths.some(path => pathname === path)) {
            return NextResponse.next();
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = request.cookies.get('token')?.value;
        const adminToken = request.cookies.get('adminToken')?.value;
        let userData = null;
        let adminData = null;

        try {
            if (token) {
                userData = await verifyToken(token);
            }
            if (adminToken) {
                adminData = await verifyToken(adminToken);
            }
        } catch (error) {
            console.error('Token verification error:', error.message);
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (pathname.startsWith('/api')) {
            if (adminOnlyPaths.some(path => pathname.startsWith(path))) {
                if (!adminData || adminData.role !== 'admin') {
                    return new NextResponse(JSON.stringify({ error: 'Admin access required' }), {
                        status: 403,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            } else if (pathname.startsWith('/api/contractor/invite/')||pathname.startsWith('/api/sub-contractor/invite/')) {
                let token = null; // Get token from query params
                if(pathname.startsWith('/api/contractor/invite/complete')||pathname.startsWith('/api/sub-contractor/invite/complete')){
                    token=request.cookies.get('invitetoken')?.value;
                }else{
                    token = request.nextUrl.searchParams.get('token');
                }
                if (!token) {
                    return new NextResponse(
                        JSON.stringify({ error: 'Token is required' }),
                        { status: 401, headers: { 'Content-Type': 'application/json' } }
                    );
                }
                try {
                    await verifyTokenInite(token); // Verify the invite token
                    return NextResponse.next(); // Allow access
                } catch (error) {
                    return new NextResponse(
                        JSON.stringify({ error: 'Invalid or expired token' }),
                        { status: 401, headers: { 'Content-Type': 'application/json' } }
                    );
                }
            } else if (!userData && !(adminData && adminData.role === 'admin')) {
                return new NextResponse(JSON.stringify({ error: 'Unauthorized Please Login' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else if (pathname.startsWith('/admin')) {
            if (userData && !adminData) {
                return NextResponse.redirect(new URL('/user/dashboard', request.url));
            }
            if (!adminData || adminData.role !== 'admin') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        } else if (ContractorOnlyPaths.some(path => pathname.startsWith(path))) {
            console.log(userData, "userrile")
            const allowedRoles = ['production', 'director', 'supervisor', "Contractor"];
            if (!userData || !allowedRoles.includes(userData.role)) {
                return NextResponse.redirect(new URL('/user/dashboard', request.url));
            }
        } else if (supervisorOnlyPaths.some(path => pathname.startsWith(path))) {
            if (!userData || userData.role !== 'Contractor') {
                return NextResponse.redirect(new URL('/user/dashboard', request.url));
            }
        } else if (subContractorOnlyPaths.some(path => pathname.startsWith(path))) {
            if (!userData || userData.role !== 'Sub-Contractor') {
                return NextResponse.redirect(new URL('/user/dashboard', request.url));
            }
        } else if (pathname.startsWith('/user') || pathname.startsWith('/employee')) {
            if (adminData) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            if (!userData) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } else if (!userData && !(adminData && adminData.role === 'admin')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware global error:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/user/:path*',
        '/employee/:path*',
        '/api/:path*',
        '/((?!login|signup|invited|invited/subcontractor|favicon.ico|logo.svg|sitemap.xml|_next/static|_next/image|.next/static|.next/image|assets).*)'  // Update this line
    ]
};


