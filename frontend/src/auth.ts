import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
import { ZodError } from "zod";
import { signInSchema } from "./zodHelper";
// import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    basePath: "/auth",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile: (profile) => {
                return {
                    email: profile.email,
                    name: profile.name,
                    image: profile.image,
                    emailVerified: profile.email_verified,
                    role: profile.role ?? "USER",
                };
            },
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (
                credentials: Partial<Record<"email" | "password", unknown>>,
                request: Request,
            ) => {
                try {
                    const { email, password } = signInSchema.parse(credentials);

                    // Encrypt password
                    //     const vaildPassword = await bcrypt.compare(password, user.password);
                    //     if (!vaildPassword) {
                    //         throw new Error("Invalid credentials.");
                    //       }
                    // }
                    try {
                        const response = await fetch(
                            `${process.env.BACKEND_API_URL}/user/signin`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    email: email,
                                    password: password,
                                }),
                            },
                        );
                        if (!response.ok) {
                            return null;
                        } else {
                            return response.body as User;
                        }
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === "google") {
                if (!profile?.email_verified) {
                    return false;
                }
                try {
                    const response = await fetch(
                        `${process.env.BACKEND_API_URL}/user/signin`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                image: user.image,
                                password: null,
                                account: account,
                            }),
                        },
                    );
                    if (!response.ok) {
                        return false;
                    }
                } catch (error) {
                    console.error(error);
                    return false;
                }
                return true;
            }
            if (credentials) {
                return true;
            }
            return false;
        },
        async redirect({ url, baseUrl }) {
            if (url == baseUrl + "/courses") {
                return baseUrl + "/courses";
            }
            return baseUrl + "/user/profile";
        },
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            if (pathname === "/middleware-example") return !!auth;
            return true;
        },
        jwt({ token, trigger, session, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                if (user) {
                    token.id = user.id;
                    token.email = user.email as string;
                    token.name = user.name as string;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken;
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        id?: string;
        email?: string;
        name?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
        email?: string;
        name?: string;
    }
}
