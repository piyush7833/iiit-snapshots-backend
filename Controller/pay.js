import User from '../Models/User.js';
import Payment from '../Models/Payment.js'
import dotenv from "dotenv"
import crypto from 'crypto'
import { instance } from '../index.js';
dotenv.config();


//order created
let month;
export const checkout=async(req,res,next)=>{
  try {
    month=req.body.month;
    let amount;
    if(month===1){
      amount=1*100;
    }
    else if(month===3){
      amount=620*100;
    }
    else if(month===6){
      amount=1150*100;
    }
    else if(month===12){
      amount=1999*100;
    }
    const options = {
      amount: Number(amount),  // amount in the smallest currency unit //500rs
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    const order= await instance.orders.create(options); 
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}

//order verified
export const paymemtVerification=async(req,res,next)=>{
  try {
    console.log(req.body);

    const {razorpay_order_id,razorpay_signature,razorpay_payment_id}=req.body;  //destructuring
    const body=razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RZP_SECRET_KEY)
                                    .update(body.toString())
                                    .digest('hex');
    const isAuthentic=expectedSignature===razorpay_signature;
    if(isAuthentic){
      const user = await User.findOne({ _id: req.user.id });
      let date;
      if(new Date()>user.nextPayDate){
        date=new Date()
      }
      else if(new Date()<=user.nextPayDate){
        date=user.nextPayDate;
      }
      date.setMonth(date.getMonth()+month)
      const updatedRole=await User.findByIdAndUpdate(user._id,{role: "admin", nextPayDate :date });

      await Payment.create({
        userId:user._id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      })

      res.redirect(`https://iiitu-snapshots-frontend.vercel.app/paymentsuccess?reference=${razorpay_payment_id}`)
    }
    else{
      res.status(400).json("Payment is not valid")
    }

  } catch (error) {
    res.status(400);
    console.log(error);
  }
}

export const date=async(req,res,next)=>{
  try {
    const user = await User.findOne({ _id: req.user.id });
    if(new Date()>user.nextPayDate){
      date=new Date()
      res.status(200).json(date);
    }
    else if(new Date()<=user.nextPayDate){
      res.status(200).json(user.nextPayDate)
    }
    
  } catch (error) {
    console.log(error);
    res.status(400);
  }
}
