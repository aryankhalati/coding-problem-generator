export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      });
    }

    req.body = result.data; // cleaned and defaulted values
    next();
  };
}