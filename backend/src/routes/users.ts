import { Router, Request, Response } from "express";
import { createContext } from "../context";
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

// PATCH /:userId
router.patch("/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
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
        const userId = parseInt(req.params.userId);

        res.status(200).json(await getEnrollmentsByUserId(ctx, userId));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

export default router;
