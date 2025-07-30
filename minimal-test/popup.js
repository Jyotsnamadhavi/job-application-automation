document.getElementById('testBtn').addEventListener('click', () => {
    chrome.storage.sync.set({test: 'Hello from minimal test!'}, () => {
        document.getElementById('result').textContent = 'Storage test successful!';
    });
}); 