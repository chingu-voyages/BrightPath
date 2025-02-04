import moment from "moment";

export const computeCourseDuration = (course: any) => {
    let courseDuration = moment.duration();

    for (const unit of course.units) {
        const unitDuration = moment.duration();

        for (const assignment of unit.assignments) {
            unitDuration.add(assignment.duration);
        }

        unit.duration = unitDuration.asMilliseconds();
        courseDuration.add(unitDuration);
    }

    course.duration = courseDuration.asMilliseconds();
};
