import NextAuth from "next-auth";
import "next-auth/jwt";

import GoogleProvider from "next-auth/providers/google";

import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import { UnstorageAdapter } from "@auth/unstorage-adapter";

const storage = createStorage({
    driver: memoryDriver(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    basePath: "/auth",
    adapter: UnstorageAdapter(storage),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            if (pathname === "/middleware-example") return !!auth;
            return true;
        },
        jwt({ token, trigger, session, account }) {
            if (account) {
                //token.accessToken = account.access_token
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}
