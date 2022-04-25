const trustedOrigins = window.origin; // add to trusted set of origins, in our case the iframe origin and the app origin would be the same
const filterProperties = ['id','dcDescription','edmPreview','edmIsShownAt','title','link','edmPlaceLatitude','edmPlaceLongitude'];
var filteredMetaData =[]; // for obtaining the metadata from the API that is filtered with the above properties
if(sessionStorage.getItem("appMetaData")){
  filteredMetaData = JSON.parse(sessionStorage.getItem("appMetaData"));
} // if data is available in the session storage, parse it
else {
var getDataFromHuntMuseum="https://api.europeana.eu/record/v2/search.json?query=hunt museum limerick&reusability=open&media=true&languageCodes=en&wskey=extravera";
fetch(getDataFromHuntMuseum)
.then(data=>{return data.json()}).then(res=>{
   arItemsMetaData = res.items; // stores in the temporary variable arItemsMetaData, this temporary variable is created for to preserve the api response to make potential changes if required.
   
   res.items.forEach(item=>{let filtered = Object.keys(item)
  .filter(key => filterProperties.includes(key)) //fecthes only the specified properties from the arItemsMetaData array.
  .reduce((obj, key) => {
      if(Array.isArray(item[key])){
        obj[key] = item[key][0] ;
      }
      else  obj[key] = item[key];
     
      if(key=='id'){
      obj[key]= obj[key].replace('/181/', ''); //fetches the api id that start with '/181/' and truncates it
      }
  
    return obj; // filter the properties from filterProperties array of key fields
  }, {});  filteredMetaData=[...filteredMetaData,filtered]} // ES6 Syntax for obtaining the array and concatinating it
  )}).then(e=>{
  sessionStorage.setItem("appMetaData",JSON.stringify(filteredMetaData));
  });
  // call the API, fetch the data and store it in session storage
}


const iframe = document.querySelector("iframe");
iframe.addEventListener("load", () => {
  iframe.contentWindow.postMessage(
    JSON.stringify({ message: "this should be delivered to an iframe", metaData: [filteredMetaData] // open connection with Iframe upon page load is complete
})
  );
});
iframe.setAttribute("src", "./iframes/ar-iframe.html"); // set iframe attribute
var markerId; // for rendering information pertaining to the marker
function onMsg(msg) { // fired when window communication happens from the iframe
  if (!trustedOrigins.includes(msg.origin)) return;
  console.log(`Message from an iframe`, JSON.parse(msg.data));
  let arData = JSON.parse(msg.data);
  if(arData.id!=markerId){ // view is re-rendered when a new marker is found
   markerId=arData.id;
   let modelView = document.getElementById('3DObjectWindow');
   let title = document.getElementById('title');
   let desc = document.getElementById('description');
   let obj = filteredMetaData.find(item=> item.id==markerId);
   modelView.setAttribute('src',obj['edmIsShownAt'])
   modelView.classList.remove('hidden');
  title.innerHTML=obj['title'];
  desc.innerHTML= obj['dcDescription'];
  // the above code renders the page with data pertaining to the marker that is found
  }
}

window.addEventListener("message", onMsg, false); // fired as an eventlistener when data is shared between the windows
