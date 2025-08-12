// ==UserScript==
// @name         þorn (thorn) adder
// @namespace    https://pxls.space/
// @version      1.0
// @description  Replaces all "th" characters with "þ"
// @author       int3nse#0854, Mikarific#4167
// @match        https://pxls.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements ('.content', run, false);

    function run(elem) {
        elem[0].innerHTML = elem[0].innerHTML.replaceAll('TH', 'Þ').replaceAll('th', 'þ');
    }
})();