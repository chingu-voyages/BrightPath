import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
import { ZodError } from "zod";
// import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { object, string } from "zod";

import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    basePath: "/auth",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
                    const email = credentials.email as string;
                    const password = credentials.password as string;
                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    });
                    if (!user) {
                        throw new Error("Invalid credentials.");
                    }

                    // if(user.password){
                    //     const vaildPassword = await bcrypt.compare(password, user.password);
                    //     if (!vaildPassword) {
                    //         throw new Error("Invalid credentials.");
                    //       }
                    // }
                    console.log(user);
                    return user as unknown as User;
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
                const userAccount = await prisma.account.findFirst({
                    where: {
                        providerAccountId: account.providerAccountId,
                    },
                });
                if (!userAccount) {
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
                                }),
                            },
                        );
                        if (response.ok) {
                            const newUser = await prisma.user.findUnique({
                                where: {
                                    email: String(profile.email),
                                },
                            });
                            if (newUser) {
                                const newAccount = await prisma.account.create({
                                    data: {
                                        provider: account.provider,
                                        providerAccountId:
                                            account.providerAccountId,
                                        userId: newUser?.id as number,
                                    },
                                });
                                return true;
                            }
                        } else {
                            return false;
                        }
                    } catch (error) {
                        console.error(error);
                        return false;
                    }
                }
                return true;
            }
            if (credentials) {
                return true;
            }
            return false;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl + "/user/profile"; // Change '/dashboard' to your desired path
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
                    token.email = user.email;
                    token.name = user.name;
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
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}
