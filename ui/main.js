<<<<<<< HEAD
=======
//code for the counter
var counterButton=document.querySelector("#counter");
counterButton.onclick=function(){
  var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
    if (request.readyState===XMLHttpRequest.DONE){
      if (request.status===200) {
        var counter=request.responseText;
        var count=document.querySelector("#count");
        count.innerHTML=counter.toString();
      }
    }
  };
  request.open('GET','http://s-xync.imad.hasura-app.io/counter',true)
  request.send(null);
};
>>>>>>> 1c28aac5284663af8f7034202c5dc496a5f5b449
var submit=document.querySelector("#submit-btn");
submit.onclick=function(){
  //make a request
  var request=new XMLHttpRequest();
  request.onreadystatechange=function(){
    if (request.readyState===XMLHttpRequest.DONE){
      if (request.status===200) {
        alert("Successfully Logged In");
      }else if(request.status===403){
        alert("Username/Password incorrect");
      }else if(request.status===500){
        alert("Something Went Wrong");
      }
    }
  };
<<<<<<< HEAD
  var username=document.getElementById('username').value;
  var password=document.getElementById('password').value;
  console.log(username);
  console.log(password);
  request.open('POST','http://s-xync.imad.hasura-app.io/login',true);
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify({username:username,password:password}));
=======
  request.open('GET','http://s-xync.imad.hasura-app.io/submit-name?name='+name,true)
  request.send(null);
>>>>>>> 1c28aac5284663af8f7034202c5dc496a5f5b449
};
