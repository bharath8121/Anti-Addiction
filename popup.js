'use strict';

var keys_in_db = [];
var values_in_db = [];


chrome.storage.local.get(null, function(result){
  var data = [];
  var total = 0;
  for(let element in result){
    if(element!=="timer"){
    // alert(element);
    // alert(result[element]);
      data.push({'website':element, 'value':result[element]});
      total+=result[element];
    }
  }
  data.sort(function(a,b){
      return b.value - a.value;
  });

  for(let i=0;i<3;i++){
    let p = document.getElementById('n'+(i+1).toString());
    let progress = document.getElementById('f'+(i+1).toString());
    p.innerHTML = data[i].website[0].toUpperCase() + data[i].website.substring(1);
    progress.style.width = ((data[i].value/total)*100).toString() + '%';
  }
});
