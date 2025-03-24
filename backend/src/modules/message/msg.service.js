import Message from '../../../db/models/messageModel.js'

export const sendmsg =async (req ,res ,next)=>{
    const userid = req.user._id
  

    try {
        const msg_toDb = await Message.create({
            messageBody : req.body.msg_body, 
            senderID : req.body.senderid,
            receiverID : req.body.receiverid
        })
    return res.status(201).json({sucess: true , msg: "message send successfully"})
    } catch (error) {
        return res.status(400).json({success: false , msg: error.message})
    }
}


export const getallmsg =async (req ,res ,next)=>{
    const {userid} = req.params
  

    try {
        const msg_fromDb = await Message.find({$or: [{senderID: userid},{receiverID: userid}]} )
    return res.status(201).json({sucess: true , msg: "fetched successfully", data: msg_fromDb})
    } catch (error) {
        return res.status(400).json({success: false , msg: error.message})
    }
}