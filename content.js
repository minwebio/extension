
var interval = setInterval(function() {
  if (document.head) {
    clearInterval(interval);
    var links = document.head.getElementsByTagName('link');
    for (var link in links) {
      if (links.hasOwnProperty(link)) {
        var l = links[link];
        if (l.rel === 'amphtml') {
          chrome.runtime.sendMessage({replacing: window.location.href, with: l.href}, function(response) {
            if (response.replace) {
              window.location.href = response.replace;
            }
          });
        }
      }
    }
  }
}, 10);


