const trustedOrigins = window.origin;
const markers = document.getElementsByTagName("a-marker");
var parentWindow;
for(let marker of markers){
    marker.addEventListener("markerFound", (e)=>{
        parent.postMessage(
            JSON.stringify({
              message: "Marker found at the iframe window",id : marker.id, isFound:true
            })
          );
    });
    marker.addEventListener("markerLost", (e)=>{
        parent.postMessage(
            JSON.stringify({
              message: "Marker lost at the iframe window",id : marker.id, isFound:false
            })
          );
    });
}




function onMsg(msg) {
  if (!trustedOrigins.includes(msg.origin)) return;
  console.log(`Message from main window`, msg);


}

window.addEventListener("message", onMsg, false);
