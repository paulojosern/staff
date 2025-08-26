import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { constants } from '@/lib/constants';

const protectedRoutes = ['/home', '/autenticacao'];
const publicRoutes = ['/login', '/autenticacao'];

export function middleware(request: NextRequest) {
	const guid = request.cookies.get(constants.GUID_COOKIE)?.value;
	const token = request.cookies.get(constants.TOKEN_COOKIE + guid)?.value;
	const pathname = request.nextUrl.pathname;

	if (protectedRoutes.some((path) => pathname.startsWith(path)) && !token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (publicRoutes.includes(pathname) && token) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return NextResponse.next();
}
