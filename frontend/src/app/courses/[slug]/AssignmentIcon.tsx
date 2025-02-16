import { AdsClick, Book, ChecklistRtl, Monitor } from "@mui/icons-material";
import { AssignmentType } from "@prisma/client";

export const AssignmentIcon = ({ type }: { type: AssignmentType }) => {
    switch (type) {
        case AssignmentType.READING:
            return <Book fontSize="large" />;
        case AssignmentType.VIDEO:
            return <Monitor fontSize="large" />;
        case AssignmentType.INTERACTIVE:
            return <AdsClick fontSize="large" />;
        case AssignmentType.QUIZ:
        case AssignmentType.TIMED_ASSESSMENT:
            return <ChecklistRtl fontSize="large" />;
    }
};
