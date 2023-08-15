// ==UserScript==
// @name         Pxls Thin Window Dim
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically dims Pxls if the window is below a certain width. (500 pixels.)
// @author       mostly stack overflow
// @match        https://pxls.space/*
// @require  	 http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

let styleNode = document.createElement("style")
              document.querySelector("head").append(styleNode)

function resizeFn() {
	if (window.innerWidth>=500) {
		styleNode.innerHTML = `

          body::after{
          content:"";
          display:block;
          background-color:#000;
          opacity:`+0.0+`;

          position:fixed;
          left:0;
          top:0;
          z-index:999999;
          width:100%;
          height:100%;
          pointer-events: none;
          }`;
	} else {
		styleNode.innerHTML = `

          body::after{
          content:"";
          display:block;
          background-color:#000;
          opacity:`+0.60+`;

          position:fixed;
          left:0;
          top:0;
          z-index:999999;
          width:100%;
          height:100%;
          pointer-events: none;
          }`;
	}
}

window.onresize = resizeFn;
