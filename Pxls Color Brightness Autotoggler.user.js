// ==UserScript==
// @name         Pxls Color Brightness Autotoggler
// @namespace    https://pxls.space/
// @version      0.2
// @description  If the color brightness setting is turned on and below 100%, this script sets color brightness to 100% when heatmap is toggled on. Intended to fix the issue of heatmap being too dark when color brightness setting is below 100%.
// @author       hazard12100
// @match        https://pxls.space/*
// @icon         https://pxls.space/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var activated = false;
    var ogBrightness;
    //execute when h button is pressed
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyH') {
            if(!document.getElementById("heatmap").classList.contains("transparent") ){
                activated = false;
                document.getElementById("board-container").style.filter = ogBrightness;
            } else{
                ogBrightness = document.getElementById("board-container").style.filter;
                activated = true;
                setTimeout(() => { document.getElementById("board-container").style.filter = "brightness(1)"; }, 100);
            }
        }
    });
})();
