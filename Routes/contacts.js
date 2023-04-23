import express from "express"
import { addMessage,getMessage} from "../Controller/contact.js";
import { verifyToken } from "../verifyToken.js";
const router=express.Router()
router.post("/", verifyToken, addMessage)
router.get("/", verifyToken, getMessage)
export default router;