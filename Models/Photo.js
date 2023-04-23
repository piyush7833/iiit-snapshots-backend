import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
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
    imgUrl: {  //same as photourl  //thumbnail
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
    fileName:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Photo", PhotoSchema);