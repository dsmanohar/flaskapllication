if(localStorage.getItem('currentuser')){
 var getUrl=window.location;
  var baseUrl = getUrl .protocol + "//" + getUrl.host ;
  var x=window.location;
  window.location.replace(baseUrl+"/home");
}
$( ".newbutton" ).click(function(){
 var userid=$("#useid").val();
  var password=$("#password").val();
  var getUrl=window.location;
  var baseUrl = getUrl .protocol + "//" + getUrl.host ;
  data={"userid":userid,"password":password};
  fetch(getUrl,{
   method:"POST",
 body:JSON.stringify(data),
 cache:"no-cache",
   headers:new Headers({
   "content-type":"application/json"
   })
}).then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    if(data.status==="ok"){
    localStorage.setItem('currentuser',userid);
    window.location.replace(baseUrl+"/home");
    }
  });
});