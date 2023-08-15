// ==UserScript==
// @name         Pxls Coords Copier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Intended for Clueless's snapshot command, specificaly the coords parameter. Copies the coords of the current window (top left + bottom right) whenever the home key (7) on the numpad is pressed.
// @author       hazard12100
// @match        https://pxls.space/*
// @grant        GM_setClipboard
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    var url,string;
    var xmin,xmax,ymin,ymax;
    var width,height;


    //execute when numpad 7 button is pressed
    //you can use this site to find key codes https://www.toptal.com/developers/keycode
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad7') {

            var url = new URL(document.URL.replace("#","?"));
            var x = url.searchParams.get("x"); // x in url has an oddish implementation, it takes the point in the center of the window, and rounds it up or down, depending on which it is closer to
            var y = url.searchParams.get("y");
            var scale = url.searchParams.get("scale");

            width=window.innerWidth;
            height=window.innerHeight;
            xmin = x - Math.ceil((width/2)/scale);
            ymin = y - Math.ceil((height/2)/scale);

            if (xmin<0) xmin = 0;
            if (ymin<0) ymin = 0;


            xmax = parseInt(x) + Math.floor((width/2)/scale);
            ymax = parseInt(y) + Math.floor((height/2)/scale);

            //no upper bound error handling
            string = xmin + " " + ymin + " " + xmax + " " + ymax

            GM_setClipboard(string,"text");

            new SLIDEIN.Slidein(__('Copied window coords.'), 'crosshairs').show().closeAfter(3000);
        }
    });
})();
