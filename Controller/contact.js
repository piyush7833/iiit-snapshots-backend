import User from "../Models/User.js";
import Contact from "../Models/Contact.js";
import { createError } from "../error.js";

//only mongodb crud operation is used here

export const addMessage = async (req, res, next) => {
    const newmsg = new Contact({ userId: req.user.id, ...req.body });
    try {
        const savedmsg = await newmsg.save();
        res.status(200).json(savedmsg);
      }
    catch (err) {
      next(err);
    }
  };
export const getMessage = async (req, res, next) => {
  try {
      const msg =await Contact.find();
      const list = await Promise.all(
      msg.map(async (_id) => { //iterating through array of subscribed users
  
          return await Contact.findById(_id);//returning video of susbcribed channel
        })
      ); 
      res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
      }
    catch (err) {
      next(err);
    }
  };