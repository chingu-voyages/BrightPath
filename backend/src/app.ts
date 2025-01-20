import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import courseRouter from "./routes/courses";
import userRouter from "./routes/users";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/courses", courseRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("API is working!");
});

export default app;
