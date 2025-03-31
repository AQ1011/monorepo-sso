import { NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

//IDP public key
const IDP_PUBLIC_KEY = process.env.IDP_PUBLIC_KEY!;
const IDP_URL = process.env.NEXT_PUBLIC_IDP_URL!;

export async function GET(request: Request) {
  const { searchParams, origin: homeURL } = new URL(request.url);
  const accessToken = searchParams.get('accessToken');

  if (!accessToken) {
    // No accessToken, redirect to login
    const loginUrl = new URL(request.url);
    return NextResponse.redirect(loginUrl.origin);
  }

  try {
    // Verify the existing token
    const decoded = verify(accessToken, IDP_PUBLIC_KEY, {

    }) as { sub: string, name: string, email: string };

    // Create a new token with the same payload
    const web1Token = sign(
      { sub: decoded.sub, name: decoded.name, email: decoded.email },
      JWT_SECRET, // Use the new secret to sign
      { expiresIn: '1h' }
    );

    // Set the new token as an HTTP-only cookie
    (await cookies()).set({
      name: 'web1Token',
      value: web1Token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    // Redirect to the redirectUrl
    const response = NextResponse.redirect(homeURL);
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  } catch (err) {
    // Token is invalid, redirect to login
    const response = NextResponse.redirect(homeURL);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
}
