import express from "express"
import { addComment,deleteComment,getVideoComments,getPhotoComments } from "../Controller/comment.js";
import { verifyToken } from "../verifyToken.js";
const router=express.Router()
router.post("/", verifyToken,addComment) 
router.delete("/:id", verifyToken,deleteComment)
// router.delete("/:id", verifyToken,deletePhotoComment)
router.get("/videoComment/:videoId",verifyToken,getVideoComments)
router.get("/photoComment/:photoId",verifyToken,getPhotoComments)
// router.get("/:photoId",getPhotoComments)
export default router;