import NextAuth from "next-auth";
import "next-auth/jwt";

import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    basePath: "/auth",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", { user, account, profile, email, credentials });
            // attempt sign in to the backend
            // await fetch("/api/signin")
            // if successful, return true
            // if unsuccessful, try to sign up
            // store the user data in the database

            return true
        }, 
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
