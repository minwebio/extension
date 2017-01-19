

var poller = setInterval(function() {
  if (document.head) {
    clearInterval(poller);
    var links = document.head.getElementsByTagName('link');
    for(var link in links){
      if(links.hasOwnProperty(link)){
        var l = links[link];
        if(l.rel === 'amphtml'){
          console.log(l.href);
          chrome.runtime.sendMessage({replacing: window.location.href, with: l.href}, function(response) {
            if (response.replace) {
              window.location.href = response.replace;
            }
          });
        }
      }
    }
    console.log("Minweb ran.");
  }
}, 10);


