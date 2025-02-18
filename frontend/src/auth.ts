import NextAuth, { type User, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import type { Adapter } from "next-auth/adapters";
import "next-auth/jwt";

import { ZodError } from "zod";
import { signInSchema } from "./zodHelper";

function Adapter(): Adapter {
    return {
        async createUser(profile) {
            const user = await fetch(
                `${process.env.BACKEND_API_URL}/user/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: profile.email,
                        name: profile.name,
                        image: profile.image,
                    }),
                },
            );

            return user.json();
        },

        async linkAccount(account) {
            const user = await fetch(
                `${process.env.BACKEND_API_URL}/user/account`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...account,
                    }),
                },
            );

            return user.json();
        },

        async getUserByAccount(provider) {
            const res = await fetch(
                `${process.env.BACKEND_API_URL}/user/account/${provider.providerAccountId}`,
            );

            if (res.ok) {
                return res.json();
            }

            return null;
        },

        async getUserByEmail(email) {
            const res = await fetch(
                `${process.env.BACKEND_API_URL}/user/?email=${email}`,
            );

            if (res.ok) {
                return res.json();
            }

            return null;
        },
    };
}

const providers: Provider[] = [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile: (profile) => {
            return {
                id: profile.sub,
                email: profile.email,
                name: profile.name,
                image: profile.picture,
                emailVerified: profile.email_verified,
                role: "STUDENT",
                username: undefined,
                bio: undefined,
            };
        },
    }),
    Credentials({
        credentials: {
            email: { label: "Email", required: true },
            password: { label: "Password", required: true, type: "password" },
        },
        authorize: async (
            credentials: Partial<
                Record<"name" | "email" | "password", unknown>
            >,
            request: Request,
        ) => {
            try {
                const { email, password } = signInSchema.parse(credentials);

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
                }

                return (await response.json()) as User;
            } catch (error) {
                if (error instanceof ZodError) {
                    return null;
                }
                return null;
            }
        },
    }),
];

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider();
            return { id: providerData.id, name: providerData.name };
        } else {
            return { id: provider.id, name: provider.name };
        }
    })
    .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    basePath: "/auth",
    providers,
    adapter: Adapter(),
    session: { strategy: "jwt" },
    callbacks: {
        async redirect(params) {
            console.log(params);
            return params.url;
        },
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            if (pathname === "/middleware-example") return !!auth;
            return true;
        },
        jwt({ token, trigger, session, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
                token.email = user.email as string;
                token.username = user.username as string;
                token.name = user.name as string;
                token.image = user.image as string;
                token.role = user.role as string;
                token.bio = user.bio as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken;
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.username = token.username as string;
            session.user.name = token.name as string;
            session.user.image = token.image as string;
            session.user.role = token.role as string;
            session.user.bio = token.bio as string;
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

type AppUser = {
    username: string | undefined;
    role: string;
    bio: string | undefined;
};

declare module "next-auth" {
    interface User extends AppUser {}
    interface Session {
        accessToken?: string;
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends AppUser {}
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
        email?: string;
        name?: string;
        image?: string;
        role?: string;
        bio?: string;
    }
}
