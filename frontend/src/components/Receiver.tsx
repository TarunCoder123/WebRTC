import { useEffect } from "react";

export function Receiver(){
 
    useEffect(()=>{
        const socket=new WebSocket('ws://localhost:8080');
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'receiver'}));
        }


        socket.onmessage=async (event)=>{
            const message=JSON.parse(event.data);
            console.log("🚀 ~ Receiver ~ message:", message)
            
            if(message.type==='createOffer'){
                // create an answer
                const pc=new RTCPeerConnection();
                pc.setRemoteDescription(message.sdp);
                const answer=await pc.createAnswer();
                await pc.setLocalDescription(answer);
                console.log("answer sdp created on the receiver side");
                socket?.send(JSON.stringify({type:'createAnswer',sdp:pc.localDescription}));
            }else if(message.type==='createAnswer'){

            }else if(message.type==='iceCandidates'){

            }
        }
    },[]);


    return <>
    Receiver
    </>
}