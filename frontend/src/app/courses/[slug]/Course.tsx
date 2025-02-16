"use client";

import { useState } from "react";
import { createContext } from "react";
import { type Course, type Enrollment } from "@/types";

export interface ContextType {
    course: Course | null;
    enrolled: Enrollment | null;
    setEnrolled: (value: Enrollment) => void;
}

export const CoursePageContext = createContext<ContextType>({
    course: null,
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
        <CoursePageContext.Provider value={{ course, enrolled, setEnrolled }}>
            {children}
        </CoursePageContext.Provider>
    );
}
