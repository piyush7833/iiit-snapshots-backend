import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now(), expires: 360000*24 },   //expires in 1hr
});

export default mongoose.model("Token", tokenSchema);