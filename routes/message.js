import * as messageController from "../controllers/message.js";

import express from "express";

const router = express.Router();

router.get("/chat/:roomName", messageController.getOldMessage);

export default router;
