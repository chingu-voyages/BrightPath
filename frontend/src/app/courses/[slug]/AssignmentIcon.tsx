import {
    AdsClick,
    Book,
    ChecklistRtl,
    Lock,
    Monitor,
} from "@mui/icons-material";
import { AssignmentType } from "@prisma/client";

export const AssignmentIcon = ({ type }: { type: AssignmentType }) => {
    switch (type) {
        case AssignmentType.READING:
            return <Book />;
        case AssignmentType.VIDEO:
            return <Monitor />;
        case AssignmentType.INTERACTIVE:
            return <AdsClick />;
        case AssignmentType.QUIZ:
        case AssignmentType.TIMED_ASSESSMENT:
            return <ChecklistRtl />;
        default:
            return <Lock />;
    }
}
