import express from "express"
import { addComment,deleteComment,getVideoComments,getPhotoComments } from "../Controller/comment.js";
import { verifyToken } from "../verifyToken.js";
const router=express.Router()
router.post("/", verifyToken,addComment) 
router.delete("/:id", verifyToken,deleteComment)
router.get("/videoComment/:videoId",getVideoComments)
router.get("/photoComment/:photoId",getPhotoComments)
// router.get("/:photoId",getPhotoComments)
export default router;