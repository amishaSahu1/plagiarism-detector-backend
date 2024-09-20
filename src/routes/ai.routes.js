import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadDocument } from "../controllers/ai.controllers.js";

const router = express.Router();

router.route("/upload-document").post(upload.single("document"), uploadDocument);

export default router;
