import { Router } from "express";
import { createContext } from "../context";
import { getAllCourses } from "../courseController";

const router = Router();
const ctx = createContext();

// GET /courses
router.get("/", async (req, res) => {
    try {
        const courses = await getAllCourses(ctx);
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

export default router;
