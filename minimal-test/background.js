console.log('Minimal background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in background:', request);
    sendResponse({success: true, message: 'Background script responding'});
}); 