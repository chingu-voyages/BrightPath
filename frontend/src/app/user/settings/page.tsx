import UserSettingsForm from "./UserSettingsForm";

export default async function UserSettings() {
    return (
        <div className="flex items-center flex-col w-full p-0">
            <h1 className="mt-4">Settings</h1>
            <UserSettingsForm />
        </div>
    );
}
