import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Effect } from "effect";
import { refreshToken } from "./lib/action/refresh";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("access_token")?.value;
	const refreshTokenValue = request.cookies.get("refresh_token")?.value;

	const isAuthPath = ["/login", "/register", "/forgot"].some((path) => pathname.startsWith(path));

	if (isAuthPath) {
		return refreshTokenValue
			? NextResponse.redirect(new URL("/", request.url))
			: NextResponse.next();
	}

	if (!refreshTokenValue) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (accessToken) {
		return NextResponse.next();
	}

	const result = await Effect.runPromiseExit(refreshToken(refreshTokenValue));

	if (result._tag === "Failure") {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("access_token");
		response.cookies.delete("refresh_token");
		return response;
	}

	const newTokens = result.value;
	const tokenValue = newTokens.data.access_token;

	if (!tokenValue) {
		const response = NextResponse.redirect(new URL("/login", request.url));
		response.cookies.delete("access_token");
		response.cookies.delete("refresh_token");
		return response;
	}

	const response = NextResponse.next();

	response.cookies.set({
		name: "access_token",
		value: tokenValue,
		httpOnly: true,
		path: "/",
		maxAge: 60 * 60,
	});

	return response;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
