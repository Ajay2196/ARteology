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

var explorePage = document.getElementById("listArtefacts"); // get the element where artefact data would be displayed
let str = "<div class='panel__container'>"; // append html tags
filteredMetaData.forEach(item => {
    str += "<div onclick='showArtefact("+JSON.stringify(item.id)+")'  class='panel panel-flat'><img src='" + item.edmPreview + "' alt='" + item.title + "'/><h5>" + item.title + "'</h5></div>";
}); // populate aretfacts
explorePage.innerHTML = str+'</div>'; // concatenate all the elements and add it to the innerHTML

function showArtefact(id){ // called when an artefact is clicked
// to toggle  between the breadcrumb navigation
    document.getElementById("exploredItem").classList.remove("hidden");
    document.getElementById("defaultExplore").classList.add("hidden"); 

    let viewArtefact = document.getElementById('artefact');
    let listArtefacts = document.getElementById('listArtefacts');
    let modelView = document.getElementById('3DObjectWindow');
    let title = document.getElementById('title');
    let desc = document.getElementById('description');
    let obj = filteredMetaData.find(item=> item.id==id);
    modelView.setAttribute('src',obj['edmIsShownAt']);
    viewArtefact.classList.remove('hidden');
    modelView.classList.remove('hidden');
    document.getElementById('itemExploredName').innerHTML=obj['title'];
    listArtefacts.classList.add('hidden');
   title.innerHTML=obj['title'];
   desc.innerHTML= obj['dcDescription'];
//generate similar view as the main application and pick it from the matching response of the object.
   

}

function reloadOldView(){
// to toggle between the navigation upon going back.
    document.getElementById("exploredItem").classList.add("hidden");
    document.getElementById("defaultExplore").classList.remove("hidden");
}


