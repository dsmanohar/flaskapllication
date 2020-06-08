
var a=1;
var convolength=0;
function messagefunction(b){
  var x=document.getElementById("messagesbox");

var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;

    var u=baseUrl+"/static/mess1.png";
      var i=baseUrl+"/static/mess.png";
if(a===1){
 document.getElementById("newimg").src=u;

    a=0;
   x.style.display="block";
    return 0;
  }
  if(a===0){
       document.getElementById("newimg").src=i;
   x.style.display="none";

    a=1;
   return 0;
  }
}
function chatdisp(a){
  document.getElementById("chatting").style.display="block";

}
$("#postbtn").click(function(){
  var y=$("#submitpost").text();
  if(y==="")
   return 0;
  else{
     $("#post").append("<div class='newpost'>"+localStorage.getItem('currentuser')+": "+y+"</div>");
     $("#submitpost").empty();
  }
  data={"userid":localStorage.getItem('currentuser'),"post":y,"status":"posts"};
   var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
fetch(baseUrl+"/post",{
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

  });
  });
function loadfunction(){
 var getUrl=window.location;
  var baseUrl = getUrl .protocol + "//" + getUrl.host ;
if(!localStorage.getItem('currentuser')){
window.location.replace(baseUrl);
}
else{
var y=localStorage.getItem('currentuser');
data={"userid":y,"status":"ok"};
$(".userrename").replaceWith( "<h1>"+y+"</h1>" );
 fetch(baseUrl+"/home",{
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
   var array=data["data"];
   var listmsges=[];
   for(var i=0;i<array.length;i++){
   var msg="";
      if(array[i]["msg"]==="")
        msg=msg+array[i]["userid"]+" "+"click to start conversation";
       else
         msg=msg+array[i]["userid"]+" "+array[i]["msg"];
     listmsges.push(msg);
   }
     conversationdisplay(listmsges);
  });
}
data={"status":"no"};
fetch(baseUrl+"/post",{
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
     var parentarray=data["data"];
     for (var i=0;i<parentarray.length;i++){
       var holder=parentarray[i];
           $("#post").append("<div class='newpost'>"+holder[0]+": "+holder[1]+"</div>");
       }
     });

}
function  conversationdisplay(list){
if (list.length>0){
$(".nofriendsyet").remove();
var newlength=list.length;
var convolength=0;
 convolength=convolength+newlength;
for(var i=0; i<list.length;i++)
{
 var b=list[i];


 $("#messagesbox").append("<h1 class='newmsg' id='newmsg"+i+"'>"+list[i]+"</h1>");
 msgstate=true;
}
for (let i=0;i<convolength;i++)
{
let b="#newmsg"+i;
$(b).click(function(){
 displayfunction($(b).text(),b);
});
}
}
else{
}
}
function displayfunction(userid,queryid){
   userid=userid.substr(0,userid.indexOf(' '));
   var getUrl = window.location;
   $("#chatting").remove();
   data={"userid":localStorage.getItem('currentuser'),"frndid":userid,"status":"no"}
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
   $("#chatbox").append("<div class='chatting' id='chatting'> <div class='chatblock'> <h1 class='chatblock1'>"+userid+"</h1><img onclick='closechatbox()' id='closewindow' src='https://img.icons8.com/fluent/48/000000/close-window.png'/><input autocomplete='off' type='text' placeholder='Enter here' id='inputmsg' class='inputmsg'></div><div class='chatmsgs'></div></div>");
    fetch(baseUrl+"/home",{
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
     var parentarray=data["data"];
     if(parentarray!=="empty"){
     for(var i=0;i<parentarray.length;i++){
       var newarray=parentarray[i]
       for(var j=0;j<newarray.length;j++){
       var str=newarray[j];
         var userstr=str.substr(0,str.indexOf(' '));
         var msgstr=str.substr(str.indexOf(' ')+1);
         if(userstr===localStorage.getItem('currentuser')){
          $(".chatmsgs").append("<h1 class='user'>"+msgstr+"</h1>");
         }
         else{
          $(".chatmsgs").append("<h1 class='otherguy'>"+msgstr+"</h1>");
          }
       }
     }
          var wtf   = $('.chatmsgs');
  var height = wtf[0].scrollHeight;
  wtf.scrollTop(height);
     }
  });
}
function closechatbox(){

$("#chatting").remove();
}
$(document).on("keypress",function(e){
if(e.which==13){
   var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
 if($(".inputmsg").val().length==1 && $(".inputmsg").val()===" "){
     return 0;}
  if ($(".inputmsg").val().length){
     $(".chatmsgs").append("<h1 class='user'>"+$(".inputmsg").val()+"</h1>");
     data={"userid":localStorage.getItem('currentuser'),"frndid":$(".chatblock1").text(),"status":"yes","msg":$(".inputmsg").val()};

     var wtf   = $('.chatmsgs');
  var height = wtf[0].scrollHeight;
  wtf.scrollTop(height);
   $(".inputmsg").val('');
   fetch(baseUrl+"/home/chat",{
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
  });
  }
  else{}
}
});
var getUrl=window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
$("#logout").click(function(){
localStorage.removeItem("currentuser");
window.location.replace(baseUrl);
});
$("#findpeople").click(function(){
  var getUrl=window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
window.location.replace(baseUrl+"/find");
});