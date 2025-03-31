import { NextResponse } from "next/server";
import { mockUsers } from "../../../constants/mock-users";
import { sign } from "jsonwebtoken";
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const payload = {
      sub: user.username,
      name: user.name,
      email: user.email,
    };

    const token = sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as an HTTP-only cookie
    (await cookies()).set({
      name: 'accessToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          username: user.username,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
}
