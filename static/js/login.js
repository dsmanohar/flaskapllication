function myfunc(){
var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;
window.location.replace(baseUrl+"/login");
}
$( ".newbutton" ).click(function() {
  var email=$("#email").val();
  var userid=$("#userid").val();
  var password=$("#password").val();
  var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host ;

  if(!validateEmail(email) || password.length<7 || userid.length>10){
     alert("wrong details");
     alert("make sure yout user id is atmost 10 charecters and password is atleast 7");
     return 0;
  }
  data={"email":email,"userid":userid,"password":password};
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
    var obj = data;
    if(obj["status"]==="exists"){
    alert("user id already exists");
    return 0;
    }
    if(obj["status"]==="ok")
    {
     alert("account created");
     window.location.replace(baseUrl+"/login")
    }
  });
});
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}