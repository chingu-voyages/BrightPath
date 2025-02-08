"use client";

import { useState } from "react";
import { createContext } from "react";
import { type Course } from "@/types";
import { Enrollment } from "@prisma/client";

export interface ContextType {
    enrolled: Enrollment | null;
    setEnrolled: (value: Enrollment) => void;
}

export const CoursePageContext = createContext<ContextType>({
    enrolled: null,
    setEnrolled: () => {},
});

export default function CoursePage({
    children,
    course,
    enrollment,
}: {
    children: React.ReactNode;
    course: Course;
    enrollment: Enrollment | null;
}) {
    const [enrolled, setEnrolled] = useState(enrollment);

    return (
        <CoursePageContext.Provider value={{ enrolled, setEnrolled }}>
            {children}
        </CoursePageContext.Provider>
    );
}
