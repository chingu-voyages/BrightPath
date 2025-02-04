import { Router, Request, Response } from "express";
import { createContext } from "../context";
import { Prisma } from "@prisma/client";
import {
    createEnrollment,
    deleteEnrollment,
    getAllEnrollments,
    updateEnrollment,
} from "../enrollmentController";

const router = Router();
const ctx = createContext();

// GET /enrollments
router.get("/", async (req: Request, res: Response) => {
    try {
        res.status(200).json(await getAllEnrollments(ctx));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

// POST /enrollments
router.post("/", async (req: Request, res: Response) => {
    try {
        const { courseId, userId } = req.body;

        res.status(201).json(await createEnrollment(ctx, courseId, userId));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create enrollment." });
    }
});

// PATCH /enrollments/:id
router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        res.status(200).json(await updateEnrollment(ctx, id, status));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update enrollment." });
    }
});

// POST /enrollments/:id/assignment/:assignmentId/complete
router.post("/:id/complete-assignment", async (req: Request, res: Response) => {
    try {
        const enrollmentId = parseInt(req.params.id);
        const assignmentId = parseInt(req.body.assignmentId);
        const unitId = parseInt(req.body.unitId);
        const status = req.body.status;


        const enrollment = await ctx.prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });

        if (!enrollment) {
            res.status(404).json({ error: "Enrollment not found." });
            return;
        }

        const granularProgress = enrollment.granularProgress as Prisma.JsonObject;

        // @ts-ignore
        granularProgress[`${unitId}`][`${assignmentId}`] = status;

        // calculate overall progress
        // total number of assignments / number of completed assignments
        let completedAssignments = 0;
        let totalAssignments = 0;

        for (const unit in granularProgress) {
            // @ts-ignore
            for (const assignment in granularProgress[unit]) {
                totalAssignments++;
                // @ts-ignore
                if (granularProgress[unit][assignment]) {
                    completedAssignments++;
                }
            }
        }

        const overallProgress = completedAssignments / totalAssignments;

        const e = await ctx.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { granularProgress: granularProgress, progress: overallProgress },
        });

        console.log(e);
        res.status(200).json({ message: "Assignment completed." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to complete assignment." });
    }
});

// DELETE /enrollments/:id
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        res.status(200).json(await deleteEnrollment(ctx, id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete enrollment." });
    }
});

export default router;
