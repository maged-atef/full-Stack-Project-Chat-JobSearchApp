// *===> import Express, Bootstrap
import express from 'express';
import { bootstrap } from './src/app.controller.js';
import { createServer } from 'http';
import './db/connectionDB.js';
import './Utility/cronOTP.js'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import User from './db/models/user.model.js';



    //*===>  Express Server
    const app = express();
    const port = process.env.EXPRESSPORT;

    // *===> Express Listeneing on Port 
    const expressServer = app.listen(port, () => {
        console.log(`----------------Connection Checks--------------------`)
        console.log(`✔ Express Server Running on port ${port}! `)
    }
    );
    // ^--------> app start from here 
    await bootstrap(app, express)

    // *----> SOCKET IO
    const io = new Server(expressServer, { cors: { origin: "*" } })


    // * middle ware authenticate
    io.use(async (socket, next) => {
        const user_token = socket.handshake.auth.token
        console.log('usertoken: ',user_token)
        
        let { id } = jwt.verify(user_token.split(" ")[1], process.env.SECRETKEY)
        console.log('id : ',id)
        const find_id = await User.findOne({ _id: id })
        if (!find_id) return console.log('error not exists user ')
        socket.username = find_id.firstName
        socket.userid = find_id._id
        socket.id = find_id.id //set it to user id beacuse socket id is change always 
       
        next()
    })
    io.on("connection", (socket) => {
        console.log('backend connected to front')
        console.log("Socket id : ", socket.id) //always change ??? 
        console.log("id user: ", socket.userid)
        console.log("username : ", socket.username)
        console.log("handShake : ", socket.handshake.auth.token)
        
    
        // *----------<< all connected users
        const allSockets_connected = io.of('/').sockets
      
    
        // *----< loop on all connected sockets to collect online users 
        const users=[]
        for (const [id, socket] of allSockets_connected) {
            users.push({
                socketId: id, 
                username:socket.username
            })
        }
        console.log(users)
    
        // *===============> emit all online users 
        io.emit("users",users)
    
        socket.broadcast.emit('user_connected', {userid: socket.userid  ,username: socket.username})
    
        // *===============> listen on disconnect
        socket.on("disconnect",()=>{
            socket.broadcast.emit("user_disconnected",{userid: socket.userid  ,username: socket.username})
        });
    
        // *======> private message
        socket.on("private-message", ({message, to})=>{
            socket.to(to).emit("private-message",{
                message, 
                from:socket.username
            });
        });

    })
    