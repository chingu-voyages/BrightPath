import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";

export default async function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined };
}) {
    const callbackUrl = props.searchParams?.callbackUrl ?? "/";

    return (
        <div className="flex flex-col gap-2">
            <br />
            <h2>Sign In</h2>
            <form
                action={async (formData) => {
                    "use server";
                    try {
                        await signIn("credentials", formData);
                    } catch (error) {
                        if (error instanceof AuthError) {
                            //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                        }
                        throw error;
                    }
                }}
            >
                <label htmlFor="email">
                    Email:
                    <input name="email" id="email" />
                </label>
                <label htmlFor="password">
                    Password:
                    <input name="password" id="password" />
                </label>
                <input type="submit" value="Sign In" />
            </form>
            {providerMap &&
                Object.values(providerMap).map((provider) => (
                    <form
                        key={provider.id}
                        action={async () => {
                            "use server";
                            try {
                                await signIn(provider.id, {
                                    redirectTo: callbackUrl ?? "/",
                                });
                            } catch (error) {
                                // Signin can fail for a number of reasons, such as the user
                                // not existing, or the user not having the correct role.
                                // In some cases, you may want to redirect to a custom error
                                if (error instanceof AuthError) {
                                    // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                                }

                                // Otherwise if a redirects happens Next.js can handle it
                                // so you can just re-thrown the error and let Next.js handle it.
                                // Docs:
                                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                throw error;
                            }
                        }}
                    >
                        <button type="submit">
                            <span>Sign in with {provider.name}</span>
                        </button>
                    </form>
                ))}
            <br />
            <h2>Sign Up With Email</h2>
            <form
                action={async (formData) => {
                    "use server";
                    try {
                        await signIn("credentials", formData);
                    } catch (error) {
                        if (error instanceof AuthError) {
                            //   return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                        }
                        throw error;
                    }
                }}
            >
                <label htmlFor="name">
                    Name:
                    <input name="name" id="name" />
                </label>
                <label htmlFor="email">
                    Email:
                    <input name="email" id="email" />
                </label>
                <label htmlFor="password">
                    Password:
                    <input name="password" id="password" />
                </label>
                <input type="submit" value="Sign Up" />
            </form>
            {providerMap &&
                Object.values(providerMap).map((provider) => (
                    <form
                        key={provider.id}
                        action={async () => {
                            "use server";
                            try {
                                await signIn(provider.id, {
                                    redirectTo: callbackUrl ?? "/",
                                });
                            } catch (error) {
                                // Signin can fail for a number of reasons, such as the user
                                // not existing, or the user not having the correct role.
                                // In some cases, you may want to redirect to a custom error
                                if (error instanceof AuthError) {
                                    // return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                                }

                                // Otherwise if a redirects happens Next.js can handle it
                                // so you can just re-thrown the error and let Next.js handle it.
                                // Docs:
                                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                throw error;
                            }
                        }}
                    ></form>
                ))}
        </div>
    );
}
