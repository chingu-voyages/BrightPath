import { Router, Request, Response } from "express";
import { createContext } from "../context";
import { getEnrollmentsByUserId } from "../enrollmentController";

const router = Router();
const ctx = createContext();

// POST /signin
router.post("/signin", async (req, res) => {
    const { email, name, image, password, account } = req.body;
    try {
        let user = await ctx.prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            user = await ctx.prisma.user.create({
                data: {
                    email,
                    password,
                    name,
                    image,
                    role: "STUDENT",
                },
            });

            if (account) {
                await ctx.prisma.account.create({
                    data: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        userId: user.id,
                    },
                });
            }
        }
        if (user && password) {
            if (password !== user.password) {
                res.status(500).json({ error: "Incorrect credentials" });
            }
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
