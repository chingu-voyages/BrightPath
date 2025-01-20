import { Router } from "express";
import { createContext } from "../context";

const router = Router();
const ctx = createContext();

// POST /signin
router.post("/signin", async (req, res) => {
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
        res.status(200).json("Sign in successful");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to sign in." });
    }
});

export default router;
