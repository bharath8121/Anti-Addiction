// var data = {};

// chrome.storage.local.get('timer', function(result){

//     progress_bars = document.getElementById("progress-bars");
//     var total = Object.values(result);
//     var fi = total.reduce(function(total, num){
//         return parseInt(total) + parseInt(num);
//     });
//     alert(fi);

//    for(let element in result){
//        /*
//        <p id='n2'></p>
//     <div class='progress'>
//         <div id="f2" class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
//       </div>
//     <hr>      
//        */
//        var name = document.createElement("p");
//        var text = document.createTextNode(element);
//        name.appendChild(text);
//        progress_bars.appendChild(name);
//        var upper_progress = document.createElement("div");
//        upper_progress.setAttribute("class","progress");
//        var inner_progress = document.createElement("div");
//        inner_progress.setAttribute("class", "progress-bar");
//        inner_progress.setAttribute("class","progressbar");
//        inner_progress.style.width = "0%";
//        inner_progress.setAttribute("aria-valuenow","50");
//        inner_progress.setAttribute("aria-valuemin","0");
//        inner_progress.setAttribute("aria-valuemax","100");
//        upper_progress.appendChild(inner_progress);
//        progress_bars.appendChild(upper_progress);
//        var breaker = document.createElement("hr");
//        progress_bars.appendChild(breaker);






       
//    }
// /*
// <tr>
//       <th scope="row">1</th>
//       <td>Mark</td>
//       <td>Otto</td>
//       <td>@mdo</td>
//     </tr>
// */
//     var timers = result['timer'];
//     var timer_table = document.getElementById('to_put');
//     for(let element in timers){
//         var row = document.createElement("tr");
//         var theader = document.createElement("th");
//         threader.setAttribute('scope','row');
//         var website_name = document.createElement("td");
//         var text = document.createTextNode(element);
//         website_name.appendChild(text);
//         var time_val = document.createElement("td");
//         var text = document.createTextNode((timers[element]/60000).toStirng());
//         time_val.appendChild(text);
//         var delete_ = document.createElement("td");
//         var delete_button = document.createElement("button");
//         var span_button = document.createElement("span");
//         span_button.setAttribute("class","glyphicon glyphicon-trash");
//         delete_button.appendChild(span_button);
//         delete_.appendChild(delete_button);
        
        
//         row.appendChild(website_name);
//         row.appendChild(time_val);
//         row.appendChild(delete_);
//         row.appendChild(theader);
//         timer_table.appendChild(row);

//     }

// });