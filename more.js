
submit_button=document.getElementById('submit');
submit_button.addEventListener('click',store);

function store(){
    var converted_time=0;
    var website_name = document.getElementById('website_name').value.toLowerCase();
    var time = document.getElementById('time');
    //time = time.split(':');
    // for(let i=0;i<time.length;i++){

    // }
    converted_time = parseInt(time.value)*60*1000;
    chrome.storage.local.get(null,function(result){
        var temp;
        if('timer' in result){
        temp = result['timer'];
        }
        else{
            result['timer'] = {};
            temp = result['timer'];
        }
        temp[website_name+'_timer'] = converted_time;
        for(let element in temp){
            
        }
        result['timer'] = temp;
        chrome.storage.local.set(result, function(){
        });
    });
    //data_object['reason'] = 'timer';
    document.getElementById('website_name').value='';
    document.getElementById('time').value='';
    
}