import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const message = JSON.parse(data);
        //identify the sender
        if (message.type === 'sender') {
            receiverSocket = ws;
        } else if (message.type === 'receiver') {
            //identify the receiver
            senderSocket = ws;
        } else if (message.type === 'createOffer') {
            //create offer
            if (ws !== senderSocket) {
                return;
            }
            receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
        } else if (message.type === 'createAnswer') {
            //create answer
            if (ws !== receiverSocket) {
                return;
            }
            senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
        } else if (message.type === 'iceCandidate') {
            // added the ice candidates 
            if (ws === senderSocket) {
                receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            } else if (ws === receiverSocket) {
                senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
        }
        console.log(message, "message");
    });
});

// how to test the webSocket use the hopscotch
