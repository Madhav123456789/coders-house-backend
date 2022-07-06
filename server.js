// configuring dotenv
require("dotenv").config();

// importing modules
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

// db connection
require("./configs/db")(process.env.DB_URI);

// creating express app
const app = express();

// states
const PORT = 9999||process.env.PORT;
const corsOptions = { credentials: true, origin: ["http://localhost:3000"] };

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// routers
app.use("/user" , require("./routers/user-router"));
app.use("/room" , require("./routers/rooms-router"));

// listning server
app.listen(PORT , (err)=>{
    if(err){
        console.error(err);
        return;
    };

    console.log("http://localhost:"+PORT);
})
