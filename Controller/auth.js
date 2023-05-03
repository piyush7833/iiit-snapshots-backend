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
dotenv.config();
// const http = require('http');
// const querystring = require('querystring');
// const app = express();
// app.use(cookieParser);
export let signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);  //encrypting password
    const newUser = new User({ ...req.body, password: hash });  //creating new user
    await newUser.save();
    signup= await newUser.save();
    const token= await new Token({
      userId:signup._id,
      token:crypto.randomBytes(32).toString("hex")
    }).save();
    const url=`${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
    await sendEmail(newUser.email,"Verification email",emailTemplate(url,"To finish signing up, please verify your email address. This ensures we have the right email in case we need to contact you.","Please verify","your email address","Thanks for joining IIITU Snapshot"))

    res.status(200).send("An email has been sent to you verify it for further process!");
  } catch (err) {
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
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
			if (token===undefined || token===null) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
      }
				const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email,"Verification email",emailTemplate(url,"To finish signing up, please verify your email address. This ensures we have the right email in case we need to contact you.","Please verify","your email address","Thanks for joining IIITU Snapshot"))

        
			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}

    var access_token = jwt.sign({ id: user._id }, process.env.JWT);  //assigning a token to user
    var { password, ...others } = user._doc;  //stopping to send password
    res
      .cookie("access_token", access_token, {  //sending token as cookie as acess token
        httpOnly: true,  
        // secure:true,
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
      .status(200)
      .json("Logout");
  
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          // httpOnly: true,
          // secure:true,
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
          // httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
// module .exports=signin;  