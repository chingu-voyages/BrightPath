import { Router, Request, Response } from "express";
import { createContext } from "../context";
import bcrypt from "bcrypt";
import { getEnrollmentsByUserId } from "../enrollmentController";

const router = Router();
const ctx = createContext();

// POST /signin
router.post("/signin", async (req: Request, res: Response) => {
    const {
        email: email,
        name: name,
        image: image,
        password: password = undefined,
        account: account,
    } = req.body;
    try {
        let user = await ctx.prisma.user.findUnique({
            where: { email: email },
        });

        if (user && password) {
            const vaildPassword = await bcrypt.compare(
                password,
                user.password as string,
            );
            if (!vaildPassword) {
                res.status(500).json({ error: "Incorrect credentials" });
            }
        }

        if (!user && name) {
            const hashedPass = await bcrypt.hash(password, 10);
            user = await ctx.prisma.user.create({
                data: {
                    email,
                    password: hashedPass,
                    name,
                    image,
                    role: "STUDENT",
                },
            });
            if (account && user) {
                await ctx.prisma.account.create({
                    data: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                        userId: user.id,
                    },
                });
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
