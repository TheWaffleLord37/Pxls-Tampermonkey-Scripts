// ==UserScript==
// @name         Pxls Name/Ping Notifier
// @namespace    https://pxls.space/
// @version      1.1
// @description  Notifies you when your name is said in chat, and when someone replies to your message with ping on. Toggleable per tab with up arrow(8) on numpad. (Make sure to change the code below on line 12 to your username.)
// @author       Mikarific (original), hazard12100 (improved)
// @match        https://pxls.space/*
// @grant        none
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

let name = "yournamehere"; // change this to your username in lowercase.

var message;
var chatbody = document.getElementById("chat-body");

function handleMessage() {
     //run for each message
    //content = document.getElementById("chat-body").lastElementChild.lastElementChild.textContent;
    message = chatbody.lastElementChild;
    if(message.dataset.messageRaw.toLowerCase().includes(name) || message.className == "chat-line has-ping ") {
        setTimeout(function() { alert('ping/mention'); }, 0);
    }
}

$('#chat-body').on('DOMNodeInserted', 'li', handleMessage);

(function() {
    'use strict';
    var activated = true;
    //toggle on/off with up arrow(8) button on numpad
    //you can use this site to find key codes https://www.toptal.com/developers/keycode
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad8') {
            if(activated){
                $('#chat-body').off('DOMNodeInserted', 'li', handleMessage);
                activated = false
                new SLIDEIN.Slidein(__('disabled pings.'), 'bell-slash').show().closeAfter(3000)._dom.style.backgroundImage = "linear-gradient(#de5057,#e13a43)";
            } else{
                $('#chat-body').on('DOMNodeInserted', 'li', handleMessage);
                activated = true
                new SLIDEIN.Slidein(__('enabled pings.'), 'bell').show().closeAfter(3000);
            }
        }
    });
})();
