import { Router, Request, Response } from "express";
import { createContext } from "../context";
import { getEnrollmentsByUserId } from "../enrollmentController";

const router = Router();
const ctx = createContext();

// POST /signin
router.post("/signin", async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    try {
        let user = await ctx.prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            user = await ctx.prisma.user.create({
                data: {
                    email,
                    name,
                    image,
                    role: "STUDENT",
                },
            });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sign in." });
    }
});

// GET /:userId/enrollments
router.get("/:userId/enrollments", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        res.status(200).json(await getEnrollmentsByUserId(ctx, userId));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

export default router;
