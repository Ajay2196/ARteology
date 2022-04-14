const trustedOrigins = ["http://127.0.0.1:5500"];
window.onload = (e)=>{

function onMsg(msg) {
    if (!trustedOrigins.includes(msg.origin)) return;
    document.querySelector("iframe").setAttribute("src",JSON.parse(msg.data)?.source).then(()=>{
    document.querySelector('header').innerHTML="";
    document.querySelector('footer').innerHTML="";
    })
  }
  
  window.addEventListener("message", onMsg, false);
  
};