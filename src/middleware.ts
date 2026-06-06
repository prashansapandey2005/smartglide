import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware is disabled during the Mock Frontend phase
  // Client-side authentication is handled via MockAuthContext
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
