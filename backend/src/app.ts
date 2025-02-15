import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import courseRouter from "./routes/courses";
import userRouter from "./routes/users";
import enrollmentRouter from "./routes/enrollments";
import certificateRouter from "./routes/certificates";
import teamMembers from "./data/teamMembers";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
// todo
// check jwt token for protected of the routes
//
// add actual docs
// Serve static files from the "uploads" directory
app.use(
    "/uploads",
    (req, res, next) => {
        res.header(
            "Access-Control-Allow-Origin",
            process.env.FRONTEND_URL || "http://localhost:3000",
        );
        res.header("Access-Control-Allow-Methods", "GET");
        next();
    },
    express.static(path.join(__dirname, "uploads")),
);

app.use("/courses", courseRouter);
app.use("/user", userRouter);
app.use("/enrollments", enrollmentRouter);
app.use("/certificates", certificateRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("API is working!");
});
app.get("/team", (req: Request, res: Response) => {
    res.json(teamMembers);
});

export default app;
