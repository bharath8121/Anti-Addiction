var start = 0;
var timer = false;

self.addEventListener('message', async function(e){

    var data = e.data;
    var website = data['website'];
    
    switch (data.cmd){
        case 'start':
            console.log('Worker started 1');
            var prevTime = (new Date()).getTime();
            console.log('timer');
            console.log(data['timer']);
            console.log('Tracking: '+website);
            while(true){
                var currentTime = (new Date()).getTime();
                timespent = (currentTime-prevTime);
                console.log(timespent);
                prevTime = currentTime;
                console.log('sent time');
                self.postMessage({'cmd':'timespent','timespent':timespent, 'website':website});
                await sleep(2000);
                
            }
        case 'stop':
            
            console.log('stop done.')
            self.postMessage('count: ' + start.toString());
            self.close();
            break;

    }

    
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
