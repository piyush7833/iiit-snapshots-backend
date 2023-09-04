import express from "express"
import { update,getUser,deleteUser,subscribe,unsubscribe,videoLike, videoDislike, photoLike, photoDislike,photounLike,photounDislike,videounLike,videounDislike,videosave,photosave,videoremove,photoremove, videohistory, photohistory,verifyEmail,resetPasswordEmail,resetPasswordVerify,resetPassword,getUserForSignup,getUserForSignupEmail} from "../Controller/user.js";
import { verifyToken } from "../verifyToken.js";
const router=express.Router()

//update user
router.put("/:id",verifyToken,update) //we will update our user as per this id
//delete user
router.delete("/:id",verifyToken,deleteUser) 
//get user
router.get("/find/:id",getUser) //add verifytoken if user get without login

router.post("/findnameforsignup",getUserForSignup) //add verifytoken if user get without login
router.post("/findemailforsignup",getUserForSignupEmail) //add verifytoken if user get without login
//subscribe user
router.put("/sub/:id",verifyToken,subscribe) 
router.put("/videosave/:id",verifyToken,videosave) 
router.put("/videohistory/:id",verifyToken,videohistory) 
router.put("/videoremove/:id",verifyToken,videoremove) 
router.put("/photosave/:id",verifyToken,photosave) 
router.put("/photoremove/:id",verifyToken,photoremove) 
router.put("/photohistory/:id",verifyToken,photohistory) 
//unsubscribe a user
router.put("/unsub/:id",verifyToken,unsubscribe) 
//like a video
router.put("/videoLike/:videoId",verifyToken,videoLike) 
router.put("/videounLike/:videoId",verifyToken,videounLike) 
//dislike a video
router.put("/videoDislike/:videoId",verifyToken,videoDislike) 
router.put("/videounDislike/:videoId",verifyToken,videounDislike) 
//like a photo
router.put("/photoLike/:photoId",verifyToken,photoLike) 
router.put("/photounLike/:photoId",verifyToken,photounLike) 
//dislike a photo
router.put("/photoDislike/:photoId",verifyToken,photoDislike) 
router.put("/photounDislike/:photoId",verifyToken,photounDislike) 

router.get("/:id/verify/:token",verifyEmail)

router.post("/recovery",resetPasswordEmail)
router.get("/:id/reset/:resetToken",resetPasswordVerify)
router.put("/:id/reset/:resetToken",resetPassword)

export default router;