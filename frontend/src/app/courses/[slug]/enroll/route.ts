import { NextResponse } from "next/server";

type EnrollmentRequest = {
    userId: string;
    courseSlug: string;
};

export async function POST(req: Request) {
    try {
        // although this should be handled by the auth middleware
        // check if the user is authenticated, if not return an error
        // try to enroll the user in the course
        // return a success message
    } catch (error) {
        console.error("Enrollment error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

