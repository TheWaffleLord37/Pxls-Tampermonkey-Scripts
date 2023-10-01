// ==UserScript==
// @name         Undo with Esc
// @namespace    https://pxls.space/
// @version      0.1
// @description  Allow to trigger the Undo action by pressing "Esc"
// @author       NickWoods
// @match        https://pxls.space/
// @icon         https://pxls.space/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape") {
            const undoButton = document.querySelector("#undo span");

            if (undoButton) {
                e.preventDefault();
                e.stopPropagation();
                undoButton.click();
            }
        }
    });
})();