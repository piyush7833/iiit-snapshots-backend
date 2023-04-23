import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
      },
    Normalname: {
        type: String,
        required: true,
        // unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
      },
      img: {
        type: String,
        default:"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
      },
      imgName:{
        type:String,
        default:"null"
      },
      subscribers: {
        type: Number,
        default: 0,
      },
      subscribedUsers: {
        type: [String],
      },
      videosaved:{
        type:[String],
      },
      photosaved:{
        type:[String],
      },
      historyPhoto:{
        type:[String],
      },
      historyVideo:{
        type:[String],
      },
      role:{
        type:String,
        default:"user",
      },
      college:{
        type:String,
        default:"IIIT Una",
      },
      verified:{
        type:Boolean,
        default:false,
      },
      fromGoogle:{
        type:Boolean,
        default:false,
      },
      phone:{
        type:Number,
        // required:true,
      },
      isActive:{
        type:Boolean,
        default:true,
      },
      nextPayDate:{
        type:Date,
        default:new Date()
      },
},{timestamps:true}
);

export default mongoose.models.User || mongoose.model("User",UserSchema);
// module.exports =
//     mongoose.models.User || mongoose.model('User', UserSchema);