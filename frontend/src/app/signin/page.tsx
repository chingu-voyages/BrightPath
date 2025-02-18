import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Google } from "@mui/icons-material";
import Image from "next/image";

type SignInError =
    | "Signin"
    | "OAuthSignin"
    | "OAuthCallbackError"
    | "OAuthCreateAccount"
    | "EmailCreateAccount"
    | "Callback"
    | "OAuthAccountNotLinked"
    | "EmailSignin"
    | "CredentialsSignin"
    | "SessionRequired";

const signinErrors: Record<SignInError | "default", string> = {
    default: "Unable to sign in.",
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallbackError: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "The e-mail could not be sent.",
    CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
};

const SIGNIN_ERROR_URL = "/signin";

export default async function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { callbackUrl = null, error = null } = await searchParams;

    return (
        <div className="max-w-sm mx-auto mt-24">
            <div className="flex flex-col gap-y-2 text-center mb-4">
                <Image
                    src="/Logo_Icon.png"
                    width={42}
                    height={56}
                    alt="BrightPath logo"
                    className="mx-auto"
                />

                <h3 className="text-headline-l font-semibold">Welcome</h3>
                <p>Create your free account to start learning.</p>
            </div>
            <div className="border p-5 flex flex-col gap-2 mb-6">
                {Object.values(providerMap).map((provider) => (
                    <form
                        className="flex flex-col gap-2 mb-4"
                        key={provider.id}
                        action={async () => {
                            "use server";
                            try {
                                await signIn(provider.id, {
                                    redirectTo: (callbackUrl as string) ?? "",
                                });
                            } catch (error) {
                                // Signin can fail for a number of reasons, such as the user
                                // not existing, or the user not having the correct role.
                                // In some cases, you may want to redirect to a custom error
                                if (error instanceof AuthError) {
                                    return redirect(
                                        `${SIGNIN_ERROR_URL}?error=${error.type}`,
                                    );
                                }

                                // Otherwise if a redirects happens Next.js can handle it
                                // so you can just re-thrown the error and let Next.js handle it.
                                // Docs:
                                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                throw error;
                            }
                        }}
                    >
                        <button
                            type="submit"
                            className="button-primary flex items-center justify-between"
                        >
                            <span> Sign in with {provider.name}</span>
                            <Google fontSize="large" />
                        </button>
                    </form>
                ))}

                <div className="flex items-center justify-center">
                    <hr className="w-1/2 border-gray-200" />
                    <span className="mx-2 text-gray-400">or</span>
                    <hr className="w-1/2 border-gray-200" />
                </div>

                <form
                    action={async (formData) => {
                        "use server";
                        try {
                            await signIn("credentials", formData);
                        } catch (error) {
                            if (error instanceof AuthError) {
                                return redirect(
                                    `${SIGNIN_ERROR_URL}?error=${error.type}`,
                                );
                            }
                            throw error;
                        }
                    }}
                    className="flex flex-col gap-2"
                >
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        placeholder="joe@example.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        placeholder="*******"
                    />
                    <input className="button" type="submit" value="Sign In" />
                </form>
            </div>
            {error && (
                <a
                    href="#"
                    className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                    <div className="font-normal text-gray-700 dark:text-gray-400">
                        {signinErrors[error as SignInError] ||
                            "Please contact us if this error persists."}
                    </div>
                </a>
            )}
        </div>
    );
}
