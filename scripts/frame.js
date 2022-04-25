const trustedOrigins = window.origin; // add to trusted set of origins, in our case the iframe origin and the app origin would be the same
const markers = document.getElementsByTagName("a-marker");
for(let marker of markers){
    marker.addEventListener("markerFound", (e)=>{
        parent.postMessage(
            JSON.stringify({
              message: "Marker found at the iframe window",id : marker.id, isFound:true
            })
          );
    }); // event listener for markers that are found and being shared to the main window
    marker.addEventListener("markerLost", (e)=>{
        parent.postMessage(
            JSON.stringify({
              message: "Marker lost at the iframe window",id : marker.id, isFound:false
            })
          ); // event listener for markers that are lost and same being shared to the main window
    });
}




// function onMsg(msg) {
//   if (!trustedOrigins.includes(msg.origin)) return;
//   // console.log(`Message from main window`, msg); // for debugging purposes to check the communication
// }

// window.addEventListener("message", onMsg, false);
