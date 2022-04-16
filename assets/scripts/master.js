const filterProperties = ['id','dcDescription','edmPreview','edmIsShownAt','title','link','edmPlaceLatitude','edmPlaceLongitude'];
var filteredMetaData =[];
if(sessionStorage.getItem("appMetaData")){
  filteredMetaData = JSON.parse(sessionStorage.getItem("appMetaData"));
}
else {
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
  }, {});  filteredMetaData=[...filteredMetaData,filtered]}
  )}).then(e=>{
  sessionStorage.setItem("appMetaData",JSON.stringify(filteredMetaData));
  });
}

var explorePage = document.getElementById("aretfacts");
let str = "";
filteredMetaData.forEach(item=>{
  str+="<a href='artefact.html'><div class='panel panel-flat'><img src='"+item.edmPreview+"' alt='"+item.title+"'/><h5>"+item.title+"'</h5></div></a>";
});
explorePage.innerHTML=str;
