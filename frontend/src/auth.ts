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
            if (account?.provider === "google") {
                if (!profile?.email_verified) {
                    console.error("Google email is not verified");
                    return false;
                }
                console.log("Email verified");
            }

            try {
                const token = account?.access_token;
                const response = await fetch(
                    `http://localhost:3080/user/signin`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }),
                    },
                );
                if (response.ok) {
                    console.log("User signed in");
                    return true;
                } else {
                    console.log("Sign in failed");
                    return false;
                }
            } catch (error) {
                console.error(error);
                return false;
            }
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
