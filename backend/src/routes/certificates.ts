import { Router, Request, Response } from "express";
import { createContext } from "../context";

const router = Router();
const ctx = createContext();

// GET /certificates/:id
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const certificate = await ctx.prisma.certificate.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                enrollment: {
                    include: {
                        course: true,
                    },
                },
                user: true,
            },
        });

        res.status(200).json(certificate);
    } catch (error) {
        res.status(404).json({ error });
    }
});

export default router;
