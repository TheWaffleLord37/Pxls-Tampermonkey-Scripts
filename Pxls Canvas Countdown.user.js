// ==UserScript==
// @name         Pxls Canvas Countdown
// @namespace    https://pxls.space/
// @version      0.1
// @description  Canvas countdown for pxls.space
// @author       -FurryMaster-
// @license      MIT
// @match        https://pxls.space/
// @icon         https://pxls.space/favicon.ico
// @grant        window.focus
// ==/UserScript==

function createCountdownTimer(targetDate) {
  var currentDate = Math.floor(Date.now() / 1000);
  var remainingTime = targetDate - currentDate;

  function formatTime(seconds) {
    var days = Math.floor(seconds / (60 * 60 * 24));
    var hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var remainingSeconds = seconds % 60;
    return `New canvas: ${days}d ${hours}h ${minutes}min ${remainingSeconds}s`;
  }

  var countdownElement = document.createElement('div');
  countdownElement.setAttribute('id', 'countdown');
  countdownElement.classList.add('floating-panel');
  countdownElement.style.position = 'fixed';
  countdownElement.style.top = '0';
  countdownElement.style.left = '50%';
  countdownElement.style.transform = 'translateX(-50%)';
  document.body.appendChild(countdownElement);

  setInterval(() => {
    countdownElement.textContent = formatTime(remainingTime);
    remainingTime--;
  }, 1000);
}
createCountdownTimer(2000000000); // Unix time