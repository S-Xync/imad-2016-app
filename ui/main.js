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
  request.open('GET','http://localhost:8080/counter',true)
  request.send(null);
};
var nameInput=document.querySelector("#name");
var name=nameInput.value;
var submit=document.querySelector("#submit-btn");
submit.onclick=function(){
  //make a request
  //capture the response
  var names=["name1","name2","name3","name4"];
  var list='';
  for(var i=0;i<names.length;i++){
    list+='<li>'+names[i]+'</li>';
  }
  var ul=document.querySelector("#namelist");
  ul.innerHTML=list;
};
