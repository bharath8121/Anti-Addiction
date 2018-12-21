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
  worker = new Worker('worker.js');
  worker.addEventListener('message', function(e){
      var data = e.data;
      switch(data.cmd){
        case 'timespent':
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
    keys_in_db = Object.keys(result);
    values_in_db = Object.values(result);
});

function setData(key, value){
  if(typeof key !== "undefined"){
  value = parseInt(value);
  key = key.toString();
  //dataObj[key] = value;
  chrome.storage.local.get(null, function(result){
    if(result[key]){
      //alert(result[key]);
      value += parseInt(result[key]);
      result[key] = value;
      checkTimer(key, result[key]);
      var time_limit = s;
      if(time_limit>0 && value>time_limit){
        dropTab();
      }
    }
    else{
      result[key]=parseInt(value);
    }
    chrome.storage.local.set(result, function() {
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
      s =  parseInt(result['timer'][key+'_timer']);
    }
    else{
      s = -1;
    }
    
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){  


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
  }}
    else{
      console.log('No url to show');
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, isWindowClosing){

    
    if(tabId in mapper){
      var url = mapper[tabId];
      setTotalTime(url, tabId.toString());
      //setData(url, totalTime[url]);

      delete mapper[tabId];
      delete startTimes[url+'_'+tabId.toString()];
     
    }

});

// Is called when the active tab is changed.
chrome.tabs.onActivated.addListener(function(activeInfo){

  var tabId = activeInfo['tabId'];
  if(currentTab in mapper)
    setTotalTime(mapper[currentTab], currentTab.toString());
  if(tabId in mapper)
    setStartTime(mapper[tabId],tabId);
  setCurrentTab(tabId);
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
}

function sendMessage(e){
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
