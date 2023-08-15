// ==UserScript==
// @name         Pxls Milestone Alerts
// @version      1.1
// @description  Sends you an alert message when you hit all-time pixels placed milestones. Change the "counts.pixelCountAllTime === 123456" section to whatever number you want it to alert you at.
// @author       GrayTurtles#6666
// @match        *://pxls.space/*
// @grant        none
// @run-at       document-body
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

/* GLOBALS: App, $ */

(() => {
    $(window).on('pxls:pixelCounts:update', (event, counts) => {
        if (counts.pixelCountAllTime === 123456) {
            App.alert(`${counts.pixelCountAllTime} pixels!`)
        }
    });
})()
