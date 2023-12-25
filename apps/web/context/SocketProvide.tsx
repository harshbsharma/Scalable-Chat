'use client'
import React, {useState, useContext,useCallback, useEffect } from "react"
import { io,Socket } from "socket.io-client";


interface SocketProviderProps
{
    children? : React.ReactNode;
}

interface ISocketContext{
    sendMessage : (msg : string)=>any;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = ()=>{
    const state = useContext(SocketContext);
    if(!state)
    {
        throw new Error("State is undefined");
    }
    return state;
}


export const SocketProvider : React.FC<SocketProviderProps> = ({children})=>
{
    const [socket,setsocket] = useState<Socket>()
    const [messages,setmessages] = useState<string[]>([]);  

    const sendMessage: ISocketContext["sendMessage"] =useCallback((msg:string)=>{
        console.log('send message',msg);
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket]);

    const onMessageRecieved  = useCallback((msg:string)=>{
        console.log('message recieved',msg);
        const {message}  = JSON.parse(msg) as {message:string};
        setmessages((prev)=>[...prev,message]);
    },[])

    useEffect(()=>{
        const _socket  = io('http://localhost:8000');   
        _socket.on('message',onMessageRecieved);
        setsocket(_socket); 
        return ()=>{
            _socket.off('message',onMessageRecieved);
            _socket.disconnect();
           
            setsocket(undefined);   
        }
    },[])

    return(
        <SocketContext.Provider value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )
}