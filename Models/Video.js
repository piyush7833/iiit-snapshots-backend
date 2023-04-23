import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    imgUrl: {  //thumbnail
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    uploaderemail:{
      type:String,
      required:true,
    },
    photofileName:{
      type:String,
      required:true,
    },
    videofileName:{
      type:String,
      required:true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);