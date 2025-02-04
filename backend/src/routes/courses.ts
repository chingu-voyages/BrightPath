import { Router, Request, Response } from "express";
import { createContext } from "../context";
import { getAllCourses, getCourseBySlug } from "../courseController";

const router = Router();
const ctx = createContext();

// GET /courses
router.get("/", async (req: Request, res: Response) => {
    try {
        const courses = await getAllCourses(ctx);
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch courses." });
    }
});

// GET /courses/popular
router.get("/popular", async (req: Request, res: Response) => {
    try {
        const courses = await getAllCourses(ctx);
        const popularCourses = courses.slice(0, 3);
        res.status(200).json(popularCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch popular courses." });
    }
});

// GET /courses/:slug
router.get("/:slug", async (req: Request<{ slug: string }>, res: Response) => {
    try {
        const course = await getCourseBySlug(ctx, req.params.slug);

        if (!course) {
            throw new Error("Course not found.");
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(404).json({ error });
    }
});


export default router;
