"use client";

import moment from "moment";
import { useContext } from "react";
import { CoursePageContext } from "./Course";
import { Progress } from "antd";

export default function ProgressBar() {
    const { course, enrolled } = useContext(CoursePageContext);

    // todo: prepare context with adequate data
    if (!enrolled || !course) {
        return null;
    }

    const currentDuration = moment.duration(course.duration - (course.duration * enrolled.progress)).humanize();

    const progress = Math.round(enrolled.progress * 100);

    return (
        <div className="flex items-center">
            <Progress percent={progress} />

            <p className="pl-4 text-sm tracking-tight text-nowrap">
                {currentDuration}
            </p>
        </div>
    );
}
