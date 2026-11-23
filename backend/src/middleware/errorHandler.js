export function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    error: err.publicMessage || "Something went wrong while generating the problem",
    detail: err.message,
  });
}