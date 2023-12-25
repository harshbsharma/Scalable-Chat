import { Server } from "socket.io";
import Redis from 'ioredis';
import * as dotenv from "dotenv";
dotenv.config();
const redishost:any = process.env.REDIS_HOST;
const redisport:number = parseInt(process.env.REDIS_PORT as string);
const redisusername:any= process.env.REDIS_USERNAME;
const redispassword:any = process.env.REDIS_PASSWORD;


const pub = new Redis({
    host:redishost,
    port:redisport,
    username: redisusername,
    password:redispassword
});
const sub = new Redis({
    host:redishost,
    port:redisport,
    username: redisusername,
    password:redispassword
});    
class SocketService{
    private _io: Server;

    constructor(){
        console.log('SocketService constructor');
        this._io = new Server({
            cors:{
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        sub.subscribe("MESSAGES");
    }
    public initlisteners(){
        const io = this._io;
        io.on('connect',(socket)=>{
            console.log('Socket connected', socket.id);
            socket.on('event:message',async({message}:{message:string})=>{
                // console.log('New Message Recived ',message);
                // console.log(typeof(redishost),redishost);
                // console.log(typeof(redisport),redisport);
                // console.log(typeof(redisusername),redisusername);
                // console.log(typeof(redispassword),redispassword);  
                await pub.publish("MESSAGES",JSON.stringify({message}));
            })
        })
        sub.on("message",async(channel,message)=>{
            if(channel=== "MESSAGES"){
                io.emit("message",message);
            }
        })
    }
    get io(){
        return this._io;
    }
}
export default SocketService;