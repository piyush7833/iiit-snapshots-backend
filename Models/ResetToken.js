import mongoose from "mongoose";
const Schema = mongoose.Schema;

const resetTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	resetToken: { type: String, required: true },
	createdAt: { type: Date, default: Date.now(), expires: 360000 },   //expires in 1hr
});

export default mongoose.model("ResetToken", resetTokenSchema);