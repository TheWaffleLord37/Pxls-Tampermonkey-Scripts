// ==UserScript==
// @name         Pxls Scroll Through Palette (Inverted scroll direction)
// @namespace    https://pxls.space/
// @version      1.3
// @description  Allows scrolling through the palette while holding shift no matter where your cursor is located.
// @author       int3nse#0854
// @match        https://pxls.space/*
// @icon         https://pxls.space/favicon.ico
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    let hasInit = false;
    let colors;
    let colorCount;

    function selectColor(index) {
        if (!colors[index] || !colors[index].click)
            return;

        colors[index].click();
    }

    document.addEventListener('wheel', (e) => {
        if (!e.shiftKey)
            return;

        e.stopPropagation();

        if (!hasInit || !e.deltaY)
            return;

        const currentColor = $('#palette > button[data-idx]:not(.deselect-button):not(.palette-color-special).active, .deselect-button:not(.active)');
        if (!currentColor)
            return;

        const newColor = ((Number(currentColor[0].dataset.idx) + (e.deltaY > 0 ? 1 : -1))) % colorCount;

        selectColor((newColor < 0) ? colorCount + newColor : newColor);
    }, { passive: true, capture: true });

    waitForKeyElements('#palette > button:nth-child(2)', run, true);

    function run() {
        // Object where key == color id, and value is palette button node
        colors = $('#palette > button[data-idx]:not(.deselect-button):not(.palette-color-special)')
            .toArray()
            .reduce((prev, cur) => { prev[cur.dataset.idx] = cur; return prev; }, {});

        colorCount = Object.keys(colors).length;

        hasInit = true;
    }
})();
