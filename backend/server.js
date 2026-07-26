import app from "./src/app.js";
import {createServer} from "http";
import connectToDb from "./src/config/database.js";


const server = createServer(app);
connectToDb();
server.listen(3000,()=>{
    console.log("server is running on port 3000")
})