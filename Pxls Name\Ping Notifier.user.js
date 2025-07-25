// ==UserScript==
// @name         Pxls Name/Ping Notifier
// @namespace    https://pxls.space/
// @version      1.2
// @description  Notifies you when your name is said in chat, and when someone replies to your message with ping on. Toggleable per tab with up arrow(8) on numpad. (Make sure to change the code below on line 12 to your username.)
// @author       Mikarific (original), hazard12100 (improved)
// @match        https://pxls.space/*
// @grant        none
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

let name = "username"; // change this to your username in lowercase.

var chatbody = document.getElementById("chat-body");


function handleMessage(message) {
     //run for each message
    //content = document.getElementById("chat-body").lastElementChild.lastElementChild.textContent;
    if(message.dataset.messageRaw.toLowerCase().includes(name) || message.className == "chat-line has-ping ") {
        setTimeout(function() { alert('ping/mention'); }, 0);
        console.log("got ping");
    }
}

//$('#chat-body').on('DOMNodeInserted', 'li', handleMessage);

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
       for (const node of mutation.addedNodes) {
           handleMessage(node);
           //console.log("A child node has been added or removed.");
       }
    } //else if (mutation.type === "attributes") {
      //console.log(`The ${mutation.attributeName} attribute was modified.`);
    //}
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: false };

// Start observing the target node for configured mutations
observer.observe(chatbody, config);

(function() {
    'use strict';
    var activated = true;
    //toggle on/off with up arrow(8) button on numpad
    //you can use this site to find key codes https://www.toptal.com/developers/keycode
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad8') {
            if(activated){
                observer.disconnect();
                activated = false
                new SLIDEIN.Slidein(__('disabled pings.'), 'bell-slash').show().closeAfter(3000)._dom.style.backgroundImage = "linear-gradient(#de5057,#e13a43)";
            } else{
                observer.observe(chatbody, config);
                activated = true
                new SLIDEIN.Slidein(__('enabled pings.'), 'bell').show().closeAfter(3000);
            }
        }
    });
})();
