import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Coding Problem Generator API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;