import User from "./models/User.js";
import { createError } from "./error.js";
export const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        const acceptedDate = user.nextPayDate;
        const today = new Date();
        if (acceptedDate >= today) {
            const updatedRole = await User.findByIdAndUpdate(user._id, { role: "admin" });
            next();
        }
        else {
            const updatedRole = await User.findByIdAndUpdate(user._id, { role: "user" });
            return next(createError(401, "Your admin plan is expired!"))
        }
    } catch (error) {
        console.log(error);
    }


}