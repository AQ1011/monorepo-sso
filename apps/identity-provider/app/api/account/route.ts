import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { mockUsers } from '../../../constants/mock-users';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { sub: string };
    const user = mockUsers.find((u) => u.username === decoded.sub);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
