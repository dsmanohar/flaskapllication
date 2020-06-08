var getUrl = window.location;
var people=0
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
 data={"status":"ok"}
 fetch(baseUrl+'/find',{
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
      people=data.data;
     for(var i=0;i<people.length;i++){
     let f=people[i];
        $(".addpeople").append(" <div class='ok'><h1 class='person' id='person"+i+"'>"+people[i]+"</h1><button type='button' name='button' class='chatbutton' id='chatbutton"+i+"' >Msg-me</button> </div>")

 }
 clickcfunction(people.length);
 });
  function clickcfunction(people){

 for(var i=0;i<people;i++){
 let u="#person"+i;
 let y="#chatbutton"+i;

 $(y).click(function(){
  newfetchfunction($(u).text());
 });
 }
function newfetchfunction(frndid){
 var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
data={"userid": localStorage.getItem('currentuser'),"frndid":frndid,"status":"no"};
 fetch(baseUrl+'/find',{
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
   window.location.replace(baseUrl+'/home');
 });
 };
}
function idfunction(){
$("#changeid").text(localStorage.getItem('currentuser'));
}
$("#logout").click(function(){
var getUrl=window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
   localStorage.removeItem("currentuser");
  window.location.replace(baseUrl);
});