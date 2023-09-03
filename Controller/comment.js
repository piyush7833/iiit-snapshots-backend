import { createError } from "../error.js";
import Comment from "../Models/Comment.js";
import Video from "../Models/Video.js";
import Photo from "../Models/Photo.js";
// import Photo from '../Models/Photo.js'

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(comment.videoId);
    const photo = await Photo.findById(comment.photoId);
    if(video!==null){
      if (req.user.id === comment.userId || req.user.id === video.userId) {
        const deletedComment=await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedComment);
      } else {
        return next(createError(403, "You can delete ony your comment!"));
      }
    }
    else{
      if (req.user.id === comment.userId || req.user.id === photo.userId) {
        const deletedComment=await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedComment);
      } else {
        return next(createError(403, "You can delete ony your comment!"));
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getVideoComments = async (req, res, next) => {
  try {
    let comments;
      comments = await Comment.find({ videoId: req.params.videoId }).sort(createdAt);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
export const getPhotoComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ photoId: req.params.photoId }).sort(createdAt);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};