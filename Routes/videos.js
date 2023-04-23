import express from "express"
import { addVideo, deleteVideo, get, update,addView,trend,sub,getByTag,search,random,recent,myfiles,saved,history} from "../Controller/video.js";
import { verifyToken } from "../verifyToken.js";
import { verifyAdmin } from "../verifyAdmin.js";
const router=express.Router()
//create a video  //verifytoken will act as middleware
router.post("/", verifyToken,verifyAdmin, addVideo)
router.put("/:id", verifyToken,verifyAdmin, update)
router.delete("/:id",verifyToken,verifyAdmin, deleteVideo)
router.get("/find/:id", get)  //add verify token if user gets a video without login
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/myfiles",verifyToken, myfiles)
router.get("/history",verifyToken, history)
router.get("/sub",verifyToken, sub)
router.get("/saved",verifyToken, saved)
router.get("/tags", getByTag)
router.get("/search", search)
router.get("/recent", recent)
export default router;