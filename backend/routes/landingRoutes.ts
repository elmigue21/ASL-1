import { Router } from "express";
import { confirmSubscription, sendConfirmationEmail/* ,getCountries */,unsubscribe } from "../controllers/landingController";
import rateLimit from "express-rate-limit";

const router = Router();

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many requests, please try again later.",
  statusCode: 429,
  handler: (req, res, next, options) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    return res.status(options.statusCode).json({
      error: options.message,
    });
  },
});
router.get(
  "/unsubscribe",
/*   limiter, */
  unsubscribe
); // Pass control to the landingSubmit handler
router.get(
  "/confirm",
/*   limiter, */
  confirmSubscription
); // Pass control to the landingSubmit handler
router.post("/sendConfirmationEmail", limiter, sendConfirmationEmail);

// router.get("/getCountries",getCountries)

export default router;
