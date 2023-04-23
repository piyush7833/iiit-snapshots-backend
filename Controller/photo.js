import User from "../Models/User.js";
import Photo from "../Models/Photo.js";
import { createError } from "../error.js";

//only mongodb crud operation is used here

export const addPhoto = async (req, res, next) => {
    const newPhoto = new Photo({ userId: req.user.id, ...req.body });
    const user = await User.findById(req.user.id);
    try {
      if(user.role==="admin"){
        const savedPhoto = await newPhoto.save();
        res.status(200).json(savedPhoto);
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
        const photo=await Photo.findById(req.params.id);
        if(!photo) return next(createError(404,"Photo not found"))
        if(req.user.id===photo.userId){
            const updatedPhoto=await Photo.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{
                new:true
            });
            res.status(200).json(updatedPhoto)
        }
        else{
            return next(createError(403,"You can update only your photo"))
        }
    } catch (error) {
        next(error)
    }
};
export const deletePhoto=async(req,res,next)=>{
    try {
        const photo=await Photo.findById(req.params.id);
        if(!photo) return next(createError(404,"Photo not found"))
        if(req.user.id===photo.userId){
            await Photo.findByIdAndDelete(req.params.id);
            res.status(200).json("the photo has been deleted")
        }
        else{
            return next(createError(403,"You can delete only your photo"))
        }
    } catch (error) {
        next(error)
    }
};
export const get=async(req,res,next)=>{
    try {
        const photo=await Photo.findById(req.params.id);
        res.status(200).json(photo)
    } catch (error) {
        next(error)
    }
};
export const addView=async(req,res,next)=>{
    try {
        await Photo.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}  //incrementing view on photo by 1
        })
    } catch (error) {
        next(error)
    }
};
export const trend=async(req,res,next)=>{
    try {
        const photos = await Photo.find().sort({ views: -1 });  //-1 means most viewd photos and 1 means least viewd photos
        res.status(200).json(photos);
      } catch (err) {
        next(err);
      }
};
export const recent=async(req,res,next)=>{
  try {
      const photos = await Photo.find();  //-1 means most viewd videos and 1 means least viewd videos
      const list = await Promise.all(
        photos.map(async (_id) => { //iterating through array of savedvideo
          return Photo.findById(_id);//returning video of susbcribed channel
        })
      );
       res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//
    } catch (err) {
      next(err);
    }
};
export const random=async(req,res,next)=>{
    try {
        const photos = await Photo.aggregate([{ $sample: { size: 40 } }]);  //aggregagte function of mongodb will return random photos
        res.status(200).json(photos);
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
        return await Photo.find({ userId: channelId });//returning photo of susbcribed channel
      })
    );
  
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//sort as per recent photos  //.flat is used to avoid nested array in response
  } catch (err) {
    next(err);
  }
};

export const getByTag=async(req,res,next)=>{
    const tags = req.query.tags.split(",");  //splitingg tags as per ,  //it is an express js querry
    try {
      const photos = await Photo.find({ tags: { $in: tags } }).limit(20);     //finding photo as per tags //number of photo limit is 20  //&in look into tags array and if the tag is found it will return that photo
      res.status(200).json(photos);
    } catch (err) {
      next(err);
    }
};
export const search=async(req,res,next)=>{
    const query = req.query.q;
    try {
      const photos = await Photo.find({
        title: { $regex: query, $options: "i" },  //we are using regex so that if any part of title gets matched by search query it will get return
      }).limit(40);  //limit on number of photos is 40
      res.status(200).json(photos);
    } catch (err) {
      next(err);
    }
};
export const myfiles=async(req,res,next)=>{
  try {
      const user = await User.findById(req.user.id);
      if(user.role==="admin"){
        const photos = await Photo.find({userId:user._id});  //-1 means most viewd videos and 1 means least viewd videos
        res.status(200).json(photos);
      }
      else{
        return next(createError(403,"You are not an admin so you haven't have any photo uploaded"))
      }
      // console.log(user._id);
      
    } catch (err) {
      next(err);
    }
};
export const saved=async(req,res,next)=>{
  try {
    const user = await User.findById(req.user.id);//find the user id so that we can get array of his subscribed channels
    const photosaved = user.photosaved;//getting array of susbcribed users
    // res.status(200).json(savedvideo)
    const list = await Promise.all(
      photosaved.map(async (photosaved) => { //iterating through array of savedvideo
        return Photo.find({_id:photosaved});//returning video of susbcribed channel
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
    const historyphoto = user.historyPhoto;//getting array of susbcribed users
    // res.status(200).json(savedvideo)
    const list = await Promise.all(
      historyphoto.map(async (historyphoto) => { //iterating through array of savedvideo
        return Photo.find({_id:historyphoto});//returning video of susbcribed channel
      })
    );
     res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));//sort as per recent videos  //.flat is used to avoid nested array in response
  } catch (err) {
    next(err);
  }
};
