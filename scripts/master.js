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

