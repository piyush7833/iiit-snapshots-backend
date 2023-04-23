import express from "express"
import { addPhoto, deletePhoto, get, update,addView,trend,sub,getByTag,search,random,recent,myfiles,saved,history } from "../Controller/photo.js";
import { verifyToken } from "../verifyToken.js";
import { verifyAdmin } from "../verifyAdmin.js";
const router=express.Router()
//create a video
router.post("/", verifyToken,verifyAdmin, addPhoto)
router.put("/:id", verifyToken,verifyAdmin, update)
router.delete("/:id",verifyToken,verifyAdmin, deletePhoto)
router.get("/find/:id", get)  //add verify token if user gets a video without login
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/recent", recent)
router.get("/random", random)
router.get("/sub",verifyToken, sub)
router.get("/saved",verifyToken, saved)
router.get("/myfiles",verifyToken, myfiles)
router.get("/history",verifyToken, history)
router.get("/tags", getByTag)
router.get("/search", search)
export default router;