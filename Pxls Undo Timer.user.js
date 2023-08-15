// ==UserScript==
// @name         Pxls Undo Timer
// @namespace    http://pxls.space/
// @version      1.0.1
// @description  Adds a 60 second timer under your stored pixels that appears whenever you undo a pixel. (Warning: This timer appears even if you still have 1 or 2 undos left before you have to wait 60 seconds for the next 3.) (Another warning: this is not 100% accurate, it might be off by a few seconds.)
// @author       Vanilla
// @match        https://pxls.space/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @updateURL    https://gist.githubusercontent.com/FlyingSixtySix/61d6f1034d1b192a4814b7e935d13d83/raw/pxls-undo-timer.userscript.js
// @downloadURL  https://gist.githubusercontent.com/FlyingSixtySix/61d6f1034d1b192a4814b7e935d13d83/raw/pxls-undo-timer.userscript.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const cooldownElem = $('#cooldown').clone();
    cooldownElem.attr('id', 'undo-cooldown');
    cooldownElem.children().first().attr('class', 'fas fa-undo');
    cooldownElem.children().last().attr('id', 'undo-cooldown-timer');
    cooldownElem.insertAfter($('#cooldown'));

    let t;

    $(window).on('pxls:ack:undo', (event, x, y) => {
        $('#undo-cooldown').show();
        cooldownElem.css('color', '');
        const timerElem = $('#undo-cooldown-timer');
        timerElem.text(60);
        if (!t) {
            t = setInterval(() => {
                if (parseInt(timerElem.text()) === 0) {
                    cooldownElem.css('color', '#007FFF');
                    clearInterval(t);
                    t = null;
                    timerElem.text('Ready to Undo');
                    return;
                }
                timerElem.text(parseInt(timerElem.text()) - 1);
            }, 1000);
        }
    });
})();
