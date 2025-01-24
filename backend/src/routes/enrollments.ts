import { Router, Request, Response } from "express";
import { createContext } from "../context";
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollmentsByUserId, updateEnrollment } from "../enrollmentController";


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

// GET /enrollments/:userId
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        res.status(200).json(await getEnrollmentsByUserId(ctx, userId));
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
