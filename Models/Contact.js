import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        Normalname: {
            type: String,
            required: true,
        },
        email: {  //thumbnail
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);