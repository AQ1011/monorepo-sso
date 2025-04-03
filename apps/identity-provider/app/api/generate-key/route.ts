import { NextResponse } from "next/server";
import { mockUsers } from "../../../constants/mock-users";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
	const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
		modulusLength: 2048,
	});
	console.log(
		"private key",
		privateKey.export({ type: "pkcs8", format: "pem" })
	);
	console.log("public key", publicKey.export({ type: "spki", format: "pem" }));
	return NextResponse.json({
		privateKey: privateKey.export({ type: "pkcs8", format: "pem" }),
		publicKey: publicKey.export({ type: "spki", format: "pem" }),
	});
}
