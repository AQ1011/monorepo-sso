import { NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { cookies } from "next/headers";

//app jwt private key
const JWT_SECRET = process.env.JWT_SECRET!;

//identity provider public key
const IDP_PUBLIC_KEY = process.env.IDP_PUBLIC_KEY!;

export async function GET(request: Request) {
    let token = request.headers.get('authorization') || ''; 
    token = token?.replace(/^Bearer\s+/, "")
    if (!token) { 
        return NextResponse.json({
            error: "Unauthorized"
        }, {
            status: 403
        })
    }
    const decoded = verify(token, JWT_SECRET) as { sub: string, name: string, email: string };

    return NextResponse.json({
        data: {
            name: decoded.name,
            email: decoded.email,
        }
    })
}
