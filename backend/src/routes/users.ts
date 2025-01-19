import { Router } from "express";
import { createContext } from "../context";

const router = Router();
const ctx = createContext();

// POST /signin
router.post("/signin", async (req, res) => {
    try {
        // cors block requests from unauthorized domains
        // receive user data from the request body
        // attempt to sign in 
        // await ctx.prisma.user.findUniqueOrThrow
        // if successful, return true
        // if unsuccessful
        // await ctx.prisma.user.create

        res.status(200).json();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

export default router;
