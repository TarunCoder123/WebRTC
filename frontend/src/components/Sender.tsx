import { useEffect, useState } from "react"

export function Sender() {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    // const [pc,setPc] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'sender' }));
            // console.log("🚀 ~ Sender ~ socket:", socket);

        }
        setSocket(socket);
    }, []);

    async function startSendingVideo() {
        if (!socket) return;
        // create an RTCPeerConnection Instance but when negotiation
        const pc = new RTCPeerConnection();
        // create an offer
        pc.onnegotiationneeded = async () => {
            console.log("onnegotiationneeded");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({ type: 'createOffer', sdp: pc.localDescription }));
        }
        //need video/audio to re trigger this
        pc.onicecandidate = (event) => {
            console.log(event);
            if (event.candidate) {
                socket?.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate }));
            }
        }



        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                pc.setRemoteDescription(message.sdp);
            } else if (message.type === 'iceCandidates') {
                pc.addIceCandidate(message.candidate);
            }
        }

    }


    return <div>
        sender
        <div>sdfsdf</div>
        <button onClick={startSendingVideo}>Send vsdzdideo</button>
    </div>
}