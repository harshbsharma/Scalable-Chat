'use client'
import { useSocket } from "../context/SocketProvide";
import { useState } from "react";


export default function Page(){
  const {sendMessage,messages} = useSocket(); 
  const [message,setmessage] = useState(''); 
  return (
    <div>
      
      <div>
        <input
        onChange={(e)=>setmessage(e.target.value)} 
        type="text" placeholder="Enter your message here"/> 
        <button
        onClick={(e)=>sendMessage(message)}

        >
          Send</button>   
      </div>

      <div>
        <h1>All message are here</h1>

        {messages.map((e) => <li>{e}</li>)}
      </div>
    </div>  
  )
} 