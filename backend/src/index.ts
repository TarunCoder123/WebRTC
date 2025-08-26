import { WebSocketServer,WebSocket} from "ws";

const wss=new WebSocketServer({port:8080});

let senderSocket: null|WebSocket = null;
let receiverSocket: null|WebSocket = null;

wss.on('connection',function connection(ws){
    ws.on('error',console.error);

    ws.on('message',function message(data:any){
        const message=JSON.parse(data);
        //identify the sender
        //identify the receiver
        //create offer
        //create answer
        // added the ice candidates 
        console.log(message,"message");
    });

    ws.send('something');
});

// how to test the webSocket use the hopscotch
