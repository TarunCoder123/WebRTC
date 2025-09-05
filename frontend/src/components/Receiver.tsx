
import { useEffect , useRef, useState} from "react"


export const Receiver = () => {

    const [one,setOne]=useState<number>(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket: WebSocket) {
        // const video = document.createElement('video');
        // document.body.appendChild(video);

        // const pc = new RTCPeerConnection();
        // pc.ontrack = (event) => {
        //     video.srcObject = new MediaStream([event.track]);
        //     video.play();
        // }

        const pc = new RTCPeerConnection();
        const remoteStream = new MediaStream();
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
    
        pc.ontrack = (event) => {
            console.log(event,"event on receiver");
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {
                pc.setRemoteDescription(message.sdp).then(() => {
                    pc.createAnswer().then((answer) => {
                        pc.setLocalDescription(answer);
                        socket.send(JSON.stringify({
                            type: 'createAnswer',
                            sdp: answer
                        }));
                    });
                });
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        }
    }

    return <div>
        receiver
        <span>{one}</span>
        <button onClick={()=>{setOne(c=>c+1)}}>increase</button>
        {/* <video ref={videoRef} autoPlay playsInline controls /> */}
    </div>
}