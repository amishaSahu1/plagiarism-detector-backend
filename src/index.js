import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";
import aiRouter from "./routes/ai.routes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = 3008;
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
    methods: ["POST", "PATCH", "GET", "DELETE", "PUT"],
  })
);
app.use("/api/v1", aiRouter);

// AI CONFIGURATION
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.API_MODEL });

app.get("/", (req, res) => {
  res.send("<h1>Server is up and running</h1>");
});

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on :::::::::: http://localhost:${PORT}`);
});
