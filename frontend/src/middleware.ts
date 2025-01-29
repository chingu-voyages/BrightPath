import { auth } from "auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth();

    const reqPath = request.nextUrl.pathname;

    const protectedRoutes = ["/user/profile", "user/setting"];
    if (reqPath == "/auth/signin" && session?.user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (protectedRoutes.includes(reqPath) && session?.user == undefined) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
