import { createError } from "../error.js";
import User from "../Models/User.js";
import Video from "../Models/Video.js";
import Photo from "../Models/Photo.js";
import Token from "../Models/Token.js";
import ResetToken from '../Models/ResetToken.js'
import sendEmail from "../sendEmail.js";
import emailTemplate from '../emailTemplate.js'
import crypto from 'crypto'
import bcrypt from "bcryptjs";
//in this page only mongodb crud operation is used 

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,  //updating user
        },
        { new: true }  //this will show the updated user
      );
      res.status(200).json(updatedUser);  //sending updated data to user
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};



export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    var { password, ...others } = user._doc; 
    res.status(200).json(others);
  } catch (err) {
    next(err);
  }
}


export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $push: { subscribedUsers: req.params.id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },//updating subscriber count in channel id account  //by using mongodb increment operation
    });
    res.status(200).json("Subscription successfull.")
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },  //pulling the channel user id in subscribed array so that we can get which channel is unsubscibed by user  //by using mongodb pull operation
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },  //decreasing subscriber count
      });
      res.status(200).json("Unsubscription successfull.")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const videoLike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },  //add to set so that a user can like a video only once
      $pull: { dislikes: id }    //removing id from dislike if a person likes video
    })
    res.status(200).json("The video has been liked.")
  } catch (err) {
    next(err);
  }
}
export const videoDislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id }
    })
    res.status(200).json("The video has been disliked.")
  } catch (err) {
    next(err);
  }
}
export const videounLike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $pull: { likes: id }    //removing id from dislike if a person likes video
    })
    res.status(200).json("The video has been unliked.")
  } catch (err) {
    next(err);
  }
}
export const videounDislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $pull: { dislikes: id }
    })
    res.status(200).json("The video has been undisliked.")
  } catch (err) {
    next(err);
  }
}
export const photoLike = async (req, res, next) => {
  const id = req.user.id;
  const photoId = req.params.photoId;
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $addToSet: { likes: id },  //add to set so that a user can like a video only once
      $pull: { dislikes: id }    //removing id from dislike if a person likes video
    })
    res.status(200).json("The photo has been liked.")
  } catch (err) {
    next(err);
  }
}
export const photounLike = async (req, res, next) => {
  const id = req.user.id;
  const photoId = req.params.photoId;
  try {
    await Photo.findByIdAndUpdate(photoId, {
      $pull: { likes: id }    //removing id from dislike if a person likes video
    })
    res.status(200).json("The photo has been liked.")
  } catch (err) {
    next(err);
  }
}
export const photoDislike = async (req, res, next) => {
  const id = req.user.id;
  const photoId = req.params.photoId;
  try {
    await Video.findByIdAndUpdate(photoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id }
    })
    res.status(200).json("The photo has been disliked.")
  } catch (err) {
    next(err);
  }
}
export const photounDislike = async (req, res, next) => {
  const id = req.user.id;
  const photoId = req.params.photoId;
  try {
    await Video.findByIdAndUpdate(photoId, {
      $pull: { dislikes: id }
    })
    res.status(200).json("The photo has been disliked.")
  } catch (err) {
    next(err);
  }
}

export const videosave = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $addToSet: { videosaved: video._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });
    res.status(200).json("Video added")
  } catch (err) {
    next(err);
  }
};
export const videoremove = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $pull: { videosaved: video._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });
    res.status(200).json("Video removed")
  } catch (err) {
    next(err);
  }
};
export const photosave = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $addToSet: { photosaved: photo._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });
    res.status(200).json("Photo added")
  } catch (err) {
    next(err);
  }
};
export const photoremove = async (req, res, next) => {
  try {
    try {
      const photo = await Photo.findById(req.params.id);
      await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
        $pull: { photosaved: photo._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
      });
      res.status(200).json("Photo removed")
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err)
  }
};
export const videohistory = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $addToSet: { historyVideo: video._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });

    res.status(200).json("Video added to history")
  } catch (err) {
    next(err);
  }
};
export const photohistory = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    await User.findByIdAndUpdate(req.user.id, {//getting user id to update its array
      $addToSet: { historyPhoto: photo._id }, //pushing the channel user id in subscribed array so that we can get which channel is subscibed by user  //by using mongodb push operation
    });
    res.status(200).json("Photo added")
  } catch (err) {
    next(err);
  }
};


export const verifyEmail=async(req,res,next)=>{
  try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });  //if no such user exist
		const token = await Token.findOne({
      userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });  //if token not exist
		await User.findByIdAndUpdate(user._id,{verified: true });

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}


export const resetPasswordEmail=async(req,res,next)=>{
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));
    let resetToken = await ResetToken.findOne({ userId: user._id });
    if (resetToken===undefined || resetToken===null) {
      resetToken = await new ResetToken({
        userId: user._id,
        resetToken: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
      const url = `${process.env.BASE_URL}users/${user._id}/reset/${resetToken.resetToken}`;
      await sendEmail(user.email,"Recovery email",emailTemplate(url,"Welcome back to IIITU Snapshot","Recover","your account","To get back to us , Reset your password"))
      return res
      .status(200)
      .send({ message: "An Email sent to your account please reset your password for catching up " });
  } 
  catch (error) {
    console.log(error);
    next(error);
  }
}

export const resetPasswordVerify=async(req,res,next)=>{
  try {
    const user = await User.findOne({ _id: req.params.id });
    // console.log(user);
		if (!user) return res.status(400).send({ message: "Invalid link" });  //if no such user exist
		const resetToken = await ResetToken.findOne({
      userId: user._id,
			resetToken: req.params.resetToken,
		});
		if (!resetToken) return res.status(400).send({ message: "Invalid link" });  //if token not exist
    res.status(200).json("updated");  //sending updated data to user
  } catch (error) {
    next(error);
    console.log(error)
  }
}
export const resetPassword=async(req,res,next)=>{
  try {
    const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });  //if no such user exist
		const resetToken = await ResetToken.findOne({
      userId: user._id,
			resetToken: req.params.resetToken,
		});
		if (!resetToken) return res.status(400).send({ message: "Invalid link" });  //if token not exist
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const updatedPwd=await User.findByIdAndUpdate(user._id,{password: hash });
    res.status(200).json(updatedPwd);  //sending updated data to user
  } catch (error) {
    next(error);
    console.log(error)
  }
}