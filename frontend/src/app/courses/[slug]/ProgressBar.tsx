'use client'

import { useState } from "react";
import { useContext } from 'react';
import { CoursePageContext } from "./Course";

export default function ProgressBar() {
    const { enrolled } = useContext(CoursePageContext);

    if (!enrolled) {
        return null;
    }

    const progress = enrolled.progress * 100;

    return (
        <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded">
                <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="pl-3 text-sm">
                {progress}%
            </p>
            <p className="pl-4 text-sm tracking-tight text-nowrap">
                1 hour left
            </p>
        </div>
    );
}

