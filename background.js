'use strict';

var startTimes = {};
var mapper = {};
var totalTime = {};
var keys_in_db = [];
var values_in_db = [];
var currentTab;
var s = -1;

//worker
var worker = undefined;

chrome.runtime.onInstalled.addListener(function(){
  alert("Please restart chrome to start using the Application");
});

function assignWorker(){
  console.log('Creating Worker');
  worker = new Worker('worker.js');
  worker.addEventListener('message', function(e){
      var data = e.data;
      switch(data.cmd){
        case 'timespent':
          console.log('-------------SETTING THE VALUES------------------');
          console.log(data['website'],data['timespent']);
          setData(data['website'], data['timespent']);
          break;
        case 'close':
          
      }
    
  });
}

function search(key){
  chrome.storage.local.get(key, function(result){
    if(result[key]){
      return result[key];
    }
    return -1;
  });
}

//setting up the keys in database.
chrome.storage.local.get(null, function(result){
    console.log(result);
    keys_in_db = Object.keys(result);
    values_in_db = Object.values(result);
    console.log(keys_in_db);
    console.log(values_in_db);
});

function setData(key, value){
  if(typeof key !== "undefined"){
  value = parseInt(value);
  key = key.toString();
  //dataObj[key] = value;
  chrome.storage.local.get(null, function(result){
    console.log('----get in set----');
    if(result[key]){
      //alert(result[key]);
      value += parseInt(result[key]);
      console.log('the value');
      result[key] = value;
      console.log(result[key]);
      checkTimer(key, result[key]);
      var time_limit = s;
      console.log('The time_limit: ');
      console.log(time_limit);
      if(time_limit>0 && value>time_limit){
        console.log('the drop is called');
        dropTab();
      }
    }
    else{
      result[key]=parseInt(value);
    }
    chrome.storage.local.set(result, function() {
      console.log('The key-value: '+key+' '+result[key].toString());
    });
});
  }
}

function dropTab(){
    let web = mapper[currentTab];
    chrome.tabs.remove(currentTab, function(){});
    makeAlert(web);
}

function makeAlert(now_tab){
  alert('From Anti_Addictor: Your daily time limit for '+now_tab+' is over');
}

function checkTimer(key, time){
  
  chrome.storage.local.get('timer', function(result){
    if(key+'_timer' in result['timer']){
      console.log(key+' timer is '+result['timer'][key+'_timer'].toString());
      s =  parseInt(result['timer'][key+'_timer']);
    }
    else{
      console.log('no key timer');
      s = -1;
    }
    
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){  

  console.log('called UPDATED');

  if(changeInfo.status === "complete"){
    var url = tab.url;
    url = url.split('/')[2];
    var mid = url.split('.');
    if(mid[0] === "www"){
      url = mid[1];
    }
    else{
      url = mid[0];
    }
    if(!(url === "newtab")){
    
    if(!(checkFirst(tabId)) && checkUrlChange(url, tabId)){
      setTotalTime(mapper[tabId], tabId);
      //setData(mapper[tabId], totalTime[mapper[tabId]]);
      if(!(typeof worker === "undefined"))
        worker.terminate();
      delete mapper[tabId];
    }
    if(checkFirst(tabId)){
    mapper[tabId] = url;
    assignWorker();
    var e = search(url+'_timer');
    sendMessage(e);
    setStartTime(url, tabId);
    }
    console.log("Start Time");
    console.log(startTimes);
    console.log("Mapper");
    console.log(mapper);
    console.log("Total Time");
    console.log(totalTime);
  }}
    else{
      console.log('No url to show');
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, isWindowClosing){

  console.log('called ONREMOVED');
    
    if(tabId in mapper){
      var url = mapper[tabId];
      setTotalTime(url, tabId.toString());
      //setData(url, totalTime[url]);

      delete mapper[tabId];
      delete startTimes[url+'_'+tabId.toString()];
     
      console.log("Start Time");
      console.log(startTimes);
      console.log("Mapper");
      console.log(mapper);
      console.log("Total Time");
      console.log(totalTime);
    }

});

// Is called when the active tab is changed.
chrome.tabs.onActivated.addListener(function(activeInfo){
  console.log('called ONACTIVATED');

  var tabId = activeInfo['tabId'];
  if(currentTab in mapper)
    setTotalTime(mapper[currentTab], currentTab.toString());
  if(tabId in mapper)
    setStartTime(mapper[tabId],tabId);
  setCurrentTab(tabId);
  console.log("Start Time");
  console.log(startTimes);
  console.log("Mapper");
  console.log(mapper);
  console.log("Total Time");
  console.log(totalTime);
});

// Set the startaTimes of given url and tabId.
function setStartTime(url, tabId){
    startTimes[url+'_'+tabId.toString()] = (new Date()).getTime();
}

// Sets currentTab variable.
function setCurrentTab(tabId){
    if(typeof worker !== "undefined")
      worker.terminate();
    assignWorker();
    currentTab = tabId;
    if(currentTab in mapper)
      sendMessage();
    console.log(mapper[currentTab]);
    console.log("current tab");
}

function sendMessage(e){
  console.log('Sending message to Worker');
  worker.postMessage({'cmd':'start','website':mapper[currentTab],'timer':e});
}

// Calculates Total time of given id and sets it to total time.
function setTotalTime(url, id){
  if(url in totalTime)
    totalTime[url] += (new Date()).getTime() - startTimes[url+'_'+id];
  else
    totalTime[url] = (new Date()).getTime() - startTimes[url+'_'+id];
}

function checkFirst(tabId){
  return !(tabId in mapper);
}

function checkUrlChange(url, tabId){
    return !(mapper[tabId] === url);
}