// ==UserScript==
// @name         Pxls Number -> Color
// @namespace    https://pxls.space/
// @version      1.1
// @description  Allows typing the number of a color to select it. To show which numbers correspond to which color, enable "Add numbers to palette entries" in the settings.
// @author       int3nse#0854
// @match        https://pxls.space/*
// @icon         https://pxls.space/favicon.ico
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements ('#palette > button:first-child', run, true);

    function run() {
        // [ 0, ... 9 ]
        const keyWhitelist = [...Array(10).keys()].map(String);

        // Object where key == color id, and value is palette button node
        const colors = $('#palette > button[data-idx]:not(.deselect-button):not(.palette-color-special)')
        .toArray()
        .reduce((prev, cur) => { prev[cur.dataset.idx] = cur; return prev; }, {});

        console.log(colors);

        let numberBuffer = '';
        let numberTimeoutId = -1;

        function selectColor() {
            const tempBuffer = numberBuffer;
            numberBuffer = '';

            if (!colors[tempBuffer] || !colors[tempBuffer].click)
                return;

            colors[tempBuffer].click();
        }

        window.addEventListener('keydown', (e) => {
            if (e.repeat || !keyWhitelist.includes(e.key))
                return;

            numberBuffer += e.key;

            clearTimeout(numberTimeoutId);

            if (numberBuffer.length == 2)
                return selectColor();

            numberTimeoutId = setTimeout(selectColor, 400);
        });
    }
})();
