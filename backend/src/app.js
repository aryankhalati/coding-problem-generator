import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import generateRoutes from "./routes/generate.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/generate", generateRoutes);

app.use(errorHandler);

export default app;