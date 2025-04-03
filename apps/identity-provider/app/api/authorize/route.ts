import { NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Replace with your actual public and private keys
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect_url');
  const silent = searchParams.get('silent') === 'true';

  if (!redirectUrl) {
    return NextResponse.json({ message: 'redirect_url is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    console.log('no token')
    // No token, redirect to login
    const loginUrl = new URL('/?redirectUrl=' + encodeURIComponent(redirectUrl), request.url);
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  try {
    // Verify the existing token
    const decoded = verify(token, JWT_SECRET) as { sub: string, name: string, email: string };

    // Create a new token with the same payload
    const newToken = sign(
      { sub: decoded.sub, name: decoded.name, email: decoded.email },
      JWT_SECRET, // Use the private key to sign
      { expiresIn: '1h', algorithm: 'RS256' }
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

    if (silent) {
      const silentUrl = new URL(origin + '/silent-auth');
      silentUrl.searchParams.set('accessToken', newToken);
      return NextResponse.redirect(silentUrl)
    }
    // Redirect to the redirectUrl with the new token as a query parameter
    const redirectWithTokenUrl = new URL(redirectUrl);
    redirectWithTokenUrl.searchParams.set('accessToken', newToken);
    const response = NextResponse.redirect(redirectWithTokenUrl);
    return response;
  } catch (err) {
    console.log('error', err)
    if (silent) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    // Token is invalid, redirect to login
    const loginUrl = new URL('/?redirectUrl=' + encodeURIComponent(redirectUrl), request.url);
    return NextResponse.redirect(loginUrl);
  }
}
