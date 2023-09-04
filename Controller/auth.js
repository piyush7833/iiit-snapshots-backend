import mongoose from "mongoose";
import express from "express"
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import Token from '../Models/Token.js'
import sendEmail from "../sendEmail.js";
import crypto from 'crypto'
import dotenv from "dotenv"
import emailTemplate from "../emailTemplate.js";
dotenv.config();
// const http = require('http');
// const querystring = require('querystring');
// const app = express();
// app.use(cookieParser);
let reg=/.ac.in/
export let signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);  //encrypting password
    const newUser = new User({ ...req.body, password: hash });  //creating new user
    let e=newUser.email;
    let p=reg.test(e);
    if(p!=true)return next(createError(401, "Use college email id only"))
    // console.log("p"+ p);
      await newUser.save();
      signup = await newUser.save();
      const token = await new Token({
        userId: signup._id,
        token: crypto.randomBytes(32).toString("hex")
      }).save();
      const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
      await sendEmail(newUser.email, "Verification email", emailTemplate(url, "Verify Your Email Address",newUser.Normalname,"Thank you for signing up for IIITU Snapshot! To get started, please click the button below to verify your email address","Verify Email","If you didn't sign up for IIITU Snapshot, you can safely ignore this email."))
      res.status(200).send("An email has been sent to you verify it for further process!");
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export var toExport;

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    let e=user.email;
    let p=reg.test(e);
    if(p!=true)return next(createError(401, "Use college email id only"))
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (token === undefined || token === null) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "Verification email", emailTemplate(url, "Verify Your Email Address",user.Normalname,"Thank you for signing up for IIITU Snapshot! To get started, please click the button below to verify your email address","Verify Email","If you didn't sign up for IIITU Snapshot, you can safely ignore this email."))


      return res
        .status(400)
        .send({ message: "An Email sent to your account please verify" });
    }

    var token = jwt.sign({ id: user._id }, process.env.JWT);  //assigning a token to user
    var { password, ...others } = user._doc;  //stopping to send password
    res
      .cookie("access_token", token, {  //sending token as cookie as acess token
        secure: true,
        sameSite: "none"
      });
    res
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
export const signout = async (req, res, next) => {
  try {
    const user = null;
    res
      .cookie("access_token", "null", {
        secure: true,
        sameSite: "none"
      })
      .status(200)
      .json("Logout");

  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // let e=user.email;
    // let p=reg.test(e);
    // if(p!=true)return next(createError(401, "Use college email id only"))
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          secure: true,
          sameSite: "none"
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          secure: true,
          sameSite: "none"
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
// module .exports=signin;  