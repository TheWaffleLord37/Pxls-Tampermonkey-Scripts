// ==UserScript==
// @name         Pxls TTS
// @version      0.1
// @description  Enables simple text to speech for Pxls chat. "now you can have pxls brainrot beamed straight into yours ears constantly" -Kris
// @author       Kris
// @match        https://pxls.space/
// @icon         https://pxls.space/favicon.ico
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    function replaceLinks(text) {
        // Regular expression to match URLs
        const linkRegex = /(?:https?:\/\/\S+|www\.\S+)/gi;

        // Replace all links with "link"
        const replacedText = text.replace(linkRegex, 'link');

        return replacedText;
    }

    const startTime = Date.now() / 1000;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices(); // you can paste this line into browser console to see what options you have
    const voice = voices[0] // can try changing this to diffent number, is different on different devices

    let requireCommand = false; // if true, only reads messages starting with /tts

    const hook = App.chat.registerHook({
        id: "message_tts",
        get: data => {
            const message = data.message_raw.toLowerCase();
            const messageTime = data.date;
            if (messageTime < startTime) { // ignore history messages
            }
            else if (message.startsWith('/tts')){
                synth.speak(new SpeechSynthesisUtterance(replaceLinks(message.substring(4))))
                console.log('message started with /tts')
            }
            else if (!requireCommand) {

                synth.speak(new SpeechSynthesisUtterance(replaceLinks(message)))
            }
        }
    });

})();
