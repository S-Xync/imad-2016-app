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
  var username=document.getElementById('username').value;
  var password=document.getElementById('password').value;
  console.log(username);
  console.log(password);
  request.open('POST','http://localhost:8080/login',true);
  request.setRequestHeader('Content-Type-application/json');
  request.send(JSON.stringify({username:username,password:password}));
};
