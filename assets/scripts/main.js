const trustedOrigins = window.origin
const iframe = document.querySelector("iframe");
var filteredMetaData =[];
if(sessionStorage.getItem("appMetaData")){
  filteredMetaData = JSON.parse(sessionStorage.getItem("appMetaData"));
}
else {
  const filterProperties = ['id','dcDescription','edmPreview','edmIsShownAt','title','link','edmPlaceLatitude','edmPlaceLongitude'];
var getDataFromHuntMuseum="https://api.europeana.eu/record/v2/search.json?query=hunt museum limerick&reusability=open&media=true&languageCodes=en&wskey=extravera";
fetch(getDataFromHuntMuseum)
.then(data=>{return data.json()}).then(res=>{
   arItemsMetaData = res.items;
   
   res.items.forEach(item=>{let filtered = Object.keys(item)
  .filter(key => filterProperties.includes(key))
  .reduce((obj, key) => {
      if(Array.isArray(item[key])){
        obj[key] = item[key][0] ;
      }
      else  obj[key] = item[key];
     
      if(key=='id'){
      obj[key]= obj[key].replace('/181/', '');
      }
  
    return obj;
  }, {});  filteredMetaData=[...filteredMetaData,filtered]});
});
}


iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage(
    JSON.stringify({ message: "this should be delivered to an iframe", metaData: [filteredMetaData]
})
  );
});
iframe.setAttribute("src", "../iframes/ar-frame.html");
var markerId;
function onMsg(msg) {
  if (!trustedOrigins.includes(msg.origin)) return;
  console.log(`Message from an iframe`, JSON.parse(msg.data));
  let arData = JSON.parse(msg.data);
  if(arData.id!=markerId){
   markerId=arData.id;
   let modelView = document.getElementById('3DObjectWindow');
   let title = document.getElementById('title');
   let desc = document.getElementById('description');
   let obj = filteredMetaData.find(item=> item.id==markerId);
   modelView.setAttribute('src',obj['edmIsShownAt'])
   modelView.classList.remove('hidden');
  title.innerHTML=obj['title'];
  desc.innerHTML= obj['dcDescription'];
  }
}

window.addEventListener("message", onMsg, false);
