import express from "express"
import { checkout, paymemtVerification,date} from "../Controller/pay.js";
import { verifyToken } from "../verifyToken.js";

const router=express.Router()
router.post("/checkout",verifyToken,checkout)
router.post("/paymentverification",verifyToken,paymemtVerification)
router.get("/date",verifyToken,date)
export default router;