chrome.action.onClicked.addListener(function(activeTab){
    var newURL = "./index.html";
    chrome.tabs.create({ url: newURL });
  });