import { Router, Request, Response } from "express";
import { createContext } from "../context";
import bcrypt from "bcrypt";
import { getEnrollmentsByUserId } from "../enrollmentController";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const ctx = createContext();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Ensure directory exists
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// POST /signup
router.post("/signup", async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    try {
        const user = await ctx.prisma.user.create({
            data: {
                email,
                name,
                image,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user." });
    }
});

// POST /signin
router.post("/signin", async (req: Request, res: Response) => {
    const {
        email: email,
        password: password = undefined,
    } = req.body;
    try {
        let user = await ctx.prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        if (user && password) {
            const vaildPassword = await bcrypt.compare(
                password,
                user.password as string,
            );
            if (!vaildPassword) {
                res.status(500).json({ error: "Incorrect credentials" });
            }
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to sign in." });
    }
});

// GET /account/:accountId
router.get("/account/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;

    try {
        const account = await ctx.prisma.account.findFirst({
            where: { providerAccountId: accountId },
            include: { user: true },
        });

        if (!account) {
            res.status(404).json({ error: "Account not found." });
            return;
        }

        res.status(200).json(account.user);
    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ error: "Failed to fetch account." });
    }
});

// POST /account
// Link account to user
router.post("/account", async (req: Request, res: Response) => {
    const { userId, provider, providerAccountId, type, refresh_token, expires_at, access_token } = req.body;

    try {
        const account = await ctx.prisma.account.create({
            data: {
                providerId: provider,
                providerType: type,
                providerAccountId: providerAccountId,
                userId: userId,
                refreshToken: refresh_token,
                accessTokenExpires: new Date(expires_at),
                accessToken: access_token,
            },
        });

        res.status(200).json(account);
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error: "Failed to create account." });
    }
});

// PATCH /:userId
router.patch("/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { name, username, email, image, bio } = req.body;

    try {
        const updatedUser = await ctx.prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(username && { username }),
                ...(email && { email }),
                ...(image && { image }),
                ...(bio && { bio }),
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user." });
    }
});

// GET /:userId/enrollments
router.get("/:userId/enrollments", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        res.status(200).json(await getEnrollmentsByUserId(ctx, userId));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

// GET /:userId
// Get user by ID
router.get("/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user." });
    }
});

// POST /user/upload
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
    }

    const filePath = `/uploads/${req.file.filename}`;
    const fileUrl = `${process.env.BACKEND_API_URL}${filePath}`; // Construct file URL
    res.status(200).json({ url: fileUrl });
});

export default router;
