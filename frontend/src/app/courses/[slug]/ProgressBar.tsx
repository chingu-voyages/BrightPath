"use client";

import { useState } from "react";
import { useContext } from "react";
import { CoursePageContext } from "./Course";
import { Progress } from "antd";

export default function ProgressBar() {
    const { enrolled } = useContext(CoursePageContext);

    if (!enrolled) {
        return null;
    }

    const progress = enrolled.progress * 100;

    return (
        <div className="flex items-center">
            <Progress percent={progress} />

            <p className="pl-4 text-sm tracking-tight text-nowrap">
                1 hour left
            </p>
        </div>
    );
}
