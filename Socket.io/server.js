const exp = require("constants")
const express = require("express")
const app = express()
const http = require('http').createServer(app)
const port =8000
const users={}
http.listen(port,()=>{
    console.log(`Listening on port ${8000}`)
})
app.use(express.static(__dirname))
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
const io = require('socket.io')(http)
io.on('connection',(socket)=>{
    console.log("Group Chat Joined")
    socket.on("join",(data)=>{
        const {room} = data;
        socket.join(room);
        socket.emit('joinedRoom',{room})
    })
    socket.on("new_user",name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    })
    socket.on('message',(mssg)=>{
        socket.broadcast.emit('message',mssg)
    })
   socket.on("joined",(data)=>{
    const OnlineData = {
        name :data.name,
        online: "🟢Online",
        time: new Date().toLocaleTimeString()
    }
    io.emit('joined', OnlineData)
   })
})
io.on('disconnect',(socket)=>{
    console.log("Disconnected")
    socket.on("user-left",name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user_went',name)
    })
})