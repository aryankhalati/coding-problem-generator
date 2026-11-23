import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { generateRequestSchema } from "../schemas/problem.schema.js";
import { runPipeline } from "../services/pipeline.service.js";

const router = Router();

router.post("/", validateRequest(generateRequestSchema), async (req, res, next) => {
  try {
    const { problem, testCases, validation } = await runPipeline(req.body);
    res.json({
      config: req.body,
      problem,
      testCases,
      validation,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;