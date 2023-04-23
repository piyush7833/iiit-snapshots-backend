import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { toExport } from "./Controller/auth.js";

dotenv.config();
export const verifyToken = async (req, res, next) => { //acess token is null
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated!"));//verifying user to let him perform actions like ,subscribe,update,etc 


 jwt.verify(token, process.env.JWT, (err, user) => {//wehen token is not valid
    if (err) return next(createError(403, "Token is not valid!"));//if user is verified return user and let it continue where it left
    req.user = user;
    next()
  });
};