
import  mongoose, { model, Types } from "mongoose";
const messageSchema = new mongoose.Schema({
    message: {type : String ,required:true},
    senderid:{type :Types.ObjectId, ref:'User' ,required:true}
})
const chatSchema = new mongoose.Schema({
    senderid:{type :Types.ObjectId, ref:'User' ,required:true},
    receiverid:{type :Types.ObjectId, ref:'User' ,required:true},
    messages:{type:[messageSchema] ,default: []}
},{timestamps:true})


export const Chat = model('Chat',chatSchema)