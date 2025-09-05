import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
// let receiverSocket: null | WebSocket = null;
const receivers:Set<WebSocket> = new Set();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    if (message.type === 'sender') {
      senderSocket = ws;
    } else if (message.type === 'receiver') {
        receivers.add(ws);
        console.log('registered the receviers');
    //   receiverSocket = ws;
    } else if (message.type === 'createOffer') {
      if (ws !== senderSocket) {
        return;
      }
      receivers.forEach((receiver)=>{
        receiver.send(JSON.stringify({type: 'createOffer', sdp: message.sdp }));
      });
    //   receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
    } else if (message.type === 'createAnswer') {
        if (ws === senderSocket) {
            senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
        }
    } else if (message.type === 'iceCandidate') {
      if (ws === senderSocket) {
        // broadcast ICE candidates from sender → all receivers
        receivers.forEach((receiver) => {
            receiver.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
          });
        // receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      } else if (receivers.has(ws)) {
        //forward the ICE candidate from receiver -> sender
        senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      }
    }
  });


  ws.on("close", () => {
    if (ws === senderSocket) {
      senderSocket = null;
    } else if (receivers.has(ws)) {
      receivers.delete(ws);
    }
    console.log("Client disconnected");
  });

});