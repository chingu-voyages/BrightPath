import { auth } from "@/auth";

export default async function Profile() {
    const session = await auth();
    const user = session?.user!;
    return (
        <div className="p-6 bg-white space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user.name}
            </h1>

            <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-700">Profile</h2>
                <p className="text-gray-600">Your profile details go here.</p>
                <p>{user.email}</p>
                <p>{user.bio}</p>
            </div>
        </div>
    );
}
