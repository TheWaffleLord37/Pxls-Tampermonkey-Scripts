// ==UserScript==
// @name         Pxls TTS
// @version      0.3
// @description  Enables simple text to speech for Pxls chat. "now you can have pxls brainrot beamed straight into yours ears constantly" -Kris
// @author       Kris
// @match        https://pxls.space/
// @icon         https://pxls.space/favicon.ico
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    const VOICE_INDEX = 0; // can try changing this to diffent number for a different voice
    let requireCommand = false; // if true, only reads messages starting with /tts

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
    const voice = voices[VOICE_INDEX];



    const hook = App.chat.registerHook({
        id: "message_tts",
        get: data => {
            console.log(data)
            const author = data.author;
            let message = data.message_raw.toLowerCase();
            const messageTime = data.date;
            if (messageTime < startTime) { // ignore history messages
            }
            else if (message.startsWith('/tts')){
                message = replaceLinks(message.substring(4));
                let speech = new SpeechSynthesisUtterance(`${author} said. ${message}`)
                speech.voice = voice
                synth.speak(speech)
                console.log('message started with /tts')
            }
            else if (!requireCommand) {
                message = replaceLinks(message);
                let speech = new SpeechSynthesisUtterance(`${author} said. ${message}`)
                speech.voice = voice
                synth.speak(speech)
            }
        }
    });

})();
