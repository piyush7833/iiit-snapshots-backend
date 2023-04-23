import User from "../Models/User.js";
import Video from "../Models/Video.js";
import { createError } from "../error.js";

//only mongodb crud operation is used here

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    const user = await User.findById(req.user.id);
    try {
      if(user.role==="admin"){
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
      }
      else{
        return next(createError(403,"You are not an admin"))
      }
    } catch (err) {
      next(err);
    }
  };

export const update=async(req,res,next)=>{
    try {
        const video=await Video.findById(req.params.id);
        if(!video) return next(createError(404,"Video not found"))
        if(req.user.id===video.userId){
            const updatedVideo=await Video.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{
                new:true
            });
            res.status(200).json(updatedVideo)
        }
        else{
            return next(createError(403,"You can update only your video"))
        }
    } catch (error) {
        next(error)
    }
};
export const deleteVideo=async(req,res,next)=>{
    try {
        const video=await Video.findById(req.params.id);
        if(!video) return next(createError(404,"Video not found"))
        if(req.user.id===video.userId){
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("the video has een deleted")
        }
        else{
            return next(createError(403,"You can delete only your video"))
        }
    } catch (error) {
        next(error)
    }
};
export const get=async(req,res,next)=>{
    try {
        const video=await Video.findById(req.params.id);
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
};
export const addView=async(req,res,next)=>{
    try {
        await Video.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}  //incrementing view on video by 1
        })
    } catch (error) {
        next(error)
    }
};
export const recent=async(req,res,next)=>{
    try {
        const videos = await Video.find();  //-1 means most viewd videos and 1 means least viewd videos
        const list = await Promise.all(
          videos.map(async (_id) => { //iterating through array of savedvideo
            return Video.findById(_id);//returning video of susbcribed channel
          })
        );
         res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//
      } catch (err) {
        next(err);
      }
};

export const trend=async(req,res,next)=>{
    try {
        const videos = await Video.find().sort({ views: -1 });  //-1 means most viewd videos and 1 means least viewd videos
        res.status(200).json(videos);
      } catch (err) {
        next(err);
      }
};
export const random=async(req,res,next)=>{
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);  //aggregagte function of mongodb will return random videos
        res.status(200).json(videos);
      } catch (err) {
        next(err);
      }
};

export const sub=async(req,res,next)=>{
  try {
    const user = await User.findById(req.user.id);//find the user id so that we can get array of his subscribed channels
    const subscribedChannels = user.subscribedUsers;//getting array of susbcribed users
  
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => { //iterating through array of subscribed users

        return await Video.find({ userId: channelId });//returning video of susbcribed channel
      })
    ); 
  
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//sort as per recent videos  //.flat is used to avoid nested array in response
  } catch (err) {
    next(err);
  }
};
export const saved=async(req,res,next)=>{ 
  try {
    const user = await User.findById(req.user.id);//find the user id so that we can get array of his subscribed channels
    const videosaved = user.videosaved;//getting array of susbcribed users
    const list = await Promise.all(
      videosaved.map(async (videosaved) => { //iterating through array of savedvideo
        return Video.findById(videosaved);//returning video of susbcribed channel
      })
    );
     res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//sort as per recent videos  //.flat is used to avoid nested array in response
  } catch (err) {
    next(err);
  }
};
export const history=async(req,res,next)=>{
  try {
    const user = await User.findById(req.user.id);//find the user id so that we can get array of his subscribed channels
    const historyvideo = user.historyVideo;//getting array of susbcribed users
    // res.status(200).json(savedvideo)
    const list = await Promise.all(
      historyvideo.map(async (historyvideo) => { //iterating through array of savedvideo
        return Video.find({_id:historyvideo});//returning video of susbcribed channel
      })
    );
     res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//sort as per recent videos  //.flat is used to avoid nested array in response
  } catch (err) {
    next(err);
  }
};
export const myfiles=async(req,res,next)=>{
  try {
      const user = await User.findById(req.user.id);
      // console.log(user._id)
      if(user.role==="admin"){
        const videos = await Video.find({userId:user._id}).sort({createdAt:-1});  //-1 means most viewd videos and 1 means least viewd videos
        res.status(200).json(videos);
      }
      else{
        return next(createError(403,"You are not an admin so you haven't have any photo uploaded"))
      }
    } catch (err) {
      next(err);
    }
};
export const getByTag=async(req,res,next)=>{
    const tags = req.query.tags.split(",");  //splitingg tags as per ,  //it is an express js querry
    try {
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);     //finding video as per tags //number of video limit is 20  //&in look into tags array and if the tag is found it will return that video
      res.status(200).json(videos);
    } catch (err) {
      next(err);
    }
};
export const search=async(req,res,next)=>{
    const query = req.query.q;
    try {
      const videos = await Video.find({
        title: { $regex: query, $options: "i" },  //we are using regex so that if any part of title gets matched by search query it will get return
      }).limit(40);  //limit on number of videos is 40
      res.status(200).json(videos);
    } catch (err) {
      next(err);
    }
};

