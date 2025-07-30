console.log('Minimal content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);
    sendResponse({success: true, message: 'Content script responding'});
}); 