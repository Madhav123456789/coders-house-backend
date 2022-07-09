// configuring dotenv
require("dotenv").config();

// importing modules
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');

// db connection
require("./configs/db")(process.env.DB_URI);

// creating express app
const app = express();

// creating http server
const server = http.createServer(app);

//creating io
const io = socketIo(server , {
    cors:{
        origin:["http://localhost:3000"],
        Credential : true
    }
});

// states
const PORT = 9999||process.env.PORT;
const corsOptions = { credentials: true, origin: ["http://localhost:3000"] };

// middlewares
app.use(express.json({limit:"30mb"}));
app.use(cors(corsOptions));
app.use(cookieParser());
// setting data folder as static
app.use("/data" , express.static("./data"))

// routers
app.use("/user" , require("./routers/user-router"));
app.use("/room" , require("./routers/rooms-router"));

// listning server
server.listen(PORT , (err)=>{
    if(err){
        console.error(err);
        return;
    };

    console.log("http://localhost:"+PORT);
})
