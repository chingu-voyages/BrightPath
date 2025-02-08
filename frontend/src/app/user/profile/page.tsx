import { auth } from "@/auth";

export default async function Profile() {
    const session = await auth();
    const name = session?.user?.name;
    return <div>{name && <h2>Welcome, {name}!</h2>}</div>;
}
