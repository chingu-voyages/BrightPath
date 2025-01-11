import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./prisma";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("API is working!");
});

export default app;
