import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const key = req.ip; // or req.user.id

    const { success, remaining, reset } = await ratelimit.limit(key);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        reset,
      });
    }

    next();
  } catch (err) {
    console.error("Rate limit error:", err);
    next(); // fail open
  }
};

export default rateLimiter;
