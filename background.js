chrome.browserAction.setBadgeText({text: ""});
console.log("Loaded.");

var tabs = {
  //tab.id: {showing:"MIN|MAX|[none is empty string]", max:"", min:""}
};

var ignore = [];

function tabState(tabid) {
  var state = tabs[tabid];
  if (!state) {
    state = {'showing': '', min:"", max:""};
    tabs[tabid] = state;
  }
  return state;
}

function updateBadge(state) {
  if (state && state.showing) {
    chrome.browserAction.setBadgeText({text: state.showing});
  } else {
    chrome.browserAction.setBadgeText({text: ''});
  }
}
chrome.runtime.onInstalled.addListener(function (object) {

});
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({url: "http://yoursite.com/"}, function (tab) {
    console.log("New tab launched with http://yoursite.com/");
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!sender.tab) {
    // make sure we're getting a message from the content script.
    return;
  }
  var state = tabState(sender.tab.id);
  if (request.replacing) {
    if (ignore.indexOf(request.replacing) == -1) {
      state.max = request.replacing;
      state.min = request.with;
      state.showing = "MIN";
      updateBadge(state);
      sendResponse({replace: request.with});
    } else {
      state.showing = "MAX";
      updateBadge(state);
    }
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  var state = tabState(tab.id);
  if (state.showing == "MIN") {
    ignore.push(state.max);
    state.showing = "MAX";
    chrome.tabs.update(tab.id, {url: state.max});
  } else if (state.showing == "MAX") {
    var idx = ignore.indexOf(state.max);
    if (idx > -1) {
      ignore.splice(idx, 1);
    }
    chrome.tabs.update(tab.id, {url: state.min});
    state.showing = "MIN";
  }
  updateBadge(state);
});

chrome.tabs.onActivated.addListener(function(activeState) {
  var state = tabState(activeState.tabId);
  updateBadge(state);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var state = tabState(tabId);
  if (tab.url == state.min) {
    state.showing = "MIN";
  } else if (tab.url == state.max) {
    state.showing = "MAX";
  } else {
    state.showing = "";
  }
  updateBadge(state);
});
