import { NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Replace with your actual public and private keys
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect_url');

  if (!redirectUrl) {
    return NextResponse.json({ message: 'redirect_url is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    // No token, redirect to login
    const loginUrl = new URL('/?redirectUrl=' + encodeURIComponent(redirectUrl), request.url);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('Access-Control-Allow-Origin', new URL(redirectUrl).origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  try {
    // Verify the existing token
    const decoded = verify(token, JWT_SECRET) as { sub: string, name: string, email: string };

    // Create a new token with the same payload
    const newToken = sign(
      { sub: decoded.sub, name: decoded.name, email: decoded.email },
      JWT_SECRET, // Use the private key to sign
      { expiresIn: '1h' }
    );

    // Set the new token as an HTTP-only cookie
    cookieStore.set({
      name: 'accessToken',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    // Redirect to the redirectUrl with the new token as a query parameter
    const redirectWithTokenUrl = new URL(redirectUrl);
    redirectWithTokenUrl.searchParams.set('accessToken', newToken);
    const response = NextResponse.redirect(redirectWithTokenUrl);
    response.headers.set('Access-Control-Allow-Origin', new URL(redirectUrl).origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (err) {
    console.log('error', err)
    // Token is invalid, redirect to login
    const loginUrl = new URL('/?redirectUrl=' + encodeURIComponent(redirectUrl), request.url);
    return NextResponse.redirect(loginUrl);
  }
}
