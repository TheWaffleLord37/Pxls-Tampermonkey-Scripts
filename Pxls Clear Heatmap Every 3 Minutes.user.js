// ==UserScript==
// @name       Pxls Clear Heatmap Every 3 Minutes
// @version    1.0
// @description  Simulates pressing the "O" key every 3 minutes. Change "setInterval(pressKey, 180000);" to another value to change the rate at which the heatmap is reset. (Goes by milliseconds)
// @author       ChatGPT
// @match        *://pxls.space/*
// @grant      none
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

(function() {
    function pressKey() {
        // Create a new keyboard event
        var event = new KeyboardEvent('keydown', {
            key: 'o',
            code: 'KeyO',
            keyCode: 79,
            which: 79,
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            metaKey: false
        });

        // Dispatch the event to simulate the key press
        window.dispatchEvent(event);
    }

    // Function to press the key every 3 minutes (180,000 milliseconds)
    setInterval(pressKey, 180000);
})();
