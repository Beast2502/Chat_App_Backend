const {Server} = require("socket.io");

// Client URL
const io = new Server({cors : "http://localhost:3000"});

let onlineUsers = [];


io.on("connection" , (socket)=>{
    console.log("New connection" , socket.id);

    // listen to a connection
    socket.on("addNewUser" ,(userId)=>{
        !onlineUsers.some(user =>user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId : socket.id
        });

        console.log("onlineUSers" ,onlineUsers)
        io.emit("getOnlineUsers" , onlineUsers)

    });

    // add message
    socket.on("sendMessage",(message) =>{
        const user = onlineUsers.find(user => user.userId === message.recipientId)

        if(user){
            io.to(user.socketId).emit("getMessage" ,message)
        }
    })

    socket.on("disconnect", ()=>{
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers" , onlineUsers)

    })

})

io.listen(4000);
