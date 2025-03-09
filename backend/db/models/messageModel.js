import { model, Schema, Types } from "mongoose";


const MessageSchema = new Schema({
    messageBody: { type: String, required: true },
    senderID: { type: Types.ObjectId, ref: "User", required: true },
    receiverID: { type: Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date, default: null }
}, { timestamps: true })


const Message = model("message", MessageSchema)
export default Message; 