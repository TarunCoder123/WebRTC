var pc1=new RTCPeerConnection();
var pc2=new RTCPeerConnection();

pc1.createOffer().then(d => {
    console.log("pc1.offer_sdp:",d.sdp);
    return pc1.setLocalDescription(d);
})
.then(()=>pc2.setRemoteDescription(pc1.localDescription))
.then(()=>pc2.createAnswer())
.then(d=>{
   console.log("pc2.anser_sdp:",d.sdp);
   return pc2.setLocalDescription(d);
})
.then(()=>pc1.setRemoteDescription(pc2.localDescription))
.catch(console.error);

var update = (div,msg) => div.innerHTML = msg;