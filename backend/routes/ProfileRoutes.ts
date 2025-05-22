import { Router } from "express";
import multer from "multer";
import { /* changeEmail, */changeName, changeProfilePicture/* ,getProfileById,updateProfile,createProfile,deleteProfile */ } from "../controllers/ProfileController";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(), // keep file in memory as a Buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // limit size to 5MB
});

// router.post("/changeEmail",changeEmail);
router.post("/changeName",changeName)
router.post(
  "/changePFP",
  upload.single("profile_picture"),
  changeProfilePicture
);
// router.get("/:id", getProfileById);
// router.post("/", createProfile);
// router.put("/:id", updateProfile);
// router.delete("/:id", deleteProfile);

export default router;