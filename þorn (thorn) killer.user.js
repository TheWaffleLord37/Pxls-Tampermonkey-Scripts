// ==UserScript==
// @name         þorn (thorn) killer
// @namespace    https://pxls.space/
// @version      1.3
// @description  Replaces all thorn characters with "th"
// @author       int3nse#0854, pt1
// @match        https://pxls.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {

    'use strict';

    waitForKeyElements('.chat-line .content', run, false);

    function isLowerCase(char) {
        return char === char.toLocaleLowerCase() && char !== char.toLocaleUpperCase();
    }

    function run(elem) {
        elem[0].innerHTML = elem[0].innerHTML
            // Replace lowercase þ and ð
            .replaceAll(/(?<!<[^>]*)þ/g, 'th')
            .replaceAll(/(?<!<[^>]*)ð/g, 'th')
            // Replace uppercase Þ
            .replaceAll(/(?<!<[^>]*)Þ/g, (match, offset, string) => {
                if (string.length < offset + 2) return 'TH';
                if (isLowerCase(string[offset+1])) return 'Th';
                return 'TH';
            })
            // Replace uppercase Ð
            .replaceAll(/(?<!<[^>]*)Ð/g, (match, offset, string) => {
                if (string.length < offset + 2) return 'TH';
                if (isLowerCase(string[offset+1])) return 'Th';
                return 'TH';
            });
    }

})();