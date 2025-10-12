// ==UserScript==
// @name         Pxls Stack Timer
// @version      1.3
// @description  Adds a timer below your stored pixels if you have more than one pixel that shows how long until you recive your next pixel. The timer is usually green but if it's red instead, that means it's better to wait to recieve your next pixel instead of placing one right away. (Warning: this is not 100% accurate, it might be off by a few seconds.)
// @author       GrayTurtles#6666
// @match        *://pxls.space/*
// @grant        none
// @run-at       document-body
// @icon         https://pxls.space/favicon.ico
// ==/UserScript==

/* GLOBALS: App, crel, $ */

/* Warning: this is not 100% accurate, it might be off by a few seconds. */

(() => {

    const replacePxlsTimer = false // change to 'true' to see the custom timer at 0/6

    const maxStacked = 6
    const multiplier = 3


    const containerEl = crel('div', { id: 'stack-cooldown' }, null)
    containerEl.className = "text-green"
    containerEl.style.fontWeight = "bold"
    containerEl.style.display = 'none';
    function cooldown(users) {
        const cooldown = 2.5 * Math.sqrt(users + 11.96) + 6.5;

        return cooldown;
    }

    function stackCooldown(cooldown, stack) {
        function sum_up_to_n(n) {
            let r = 0;
            for (let i = 0; i <= n; i++) {
                r += i;
            }
            return r;
        }

        if (stack === 0) return cooldown;
        return (cooldown * multiplier) * (1 + stack + sum_up_to_n(stack - 1));
    }

    function getStackCount() {
        const val = parseInt(document.getElementById('placeable-count').innerText.split("/")[0])
        return Number.isNaN(val) ? 0 : val;
    }

    function start() {
        const loginUsername = document.getElementById('username').innerText
        var stack = getStackCount()
        var users = parseInt(document.getElementById('online-count-value').innerText)
        var lastPixelTime = null
        var nextPixelCooldown = null

        if (!loginUsername) {
            return
        }

        let enabled = false
        const timerEl = crel('span', { id: 'stack-timer' }, '???')
        const timerIconEl = crel('i', { class: 'fas fa-clock' })

        function loop() {
            users = parseInt(document.getElementById('online-count-value').innerText)
            stack = getStackCount()
            if (stack && stack >= maxStacked) {
                nextPixelCooldown = null
            }
            else if (replacePxlsTimer == false && document.getElementById('cooldown').style.display != "none") {
                nextPixelCooldown = null
            }
            else {
                try {
                    let cd = cooldown(users)
                    let stackCd = stackCooldown(cd, stack)
                    let delta = (new Date() - lastPixelTime) / 1000;
                    let seconds = Math.max(0, stackCd - delta) // show 0 if the time gets negative
                    nextPixelCooldown = " " + new Date(seconds * 1000).toISOString().substr(14, 5)
                    if (seconds <= cd) {
                        containerEl.className = "text-red"
                    }
                    else {
                        containerEl.className = "text-green"
                    }
                }
                catch {
                    nextPixelCooldown = null
                }
            }
            update()
        }

        function enable() {
            if (enabled) {
                return
            }
            enabled = true

            console.log("enable");
            containerEl.style.display = '';

            while (containerEl.firstChild) {
                containerEl.removeChild(containerEl.firstChild)
            }
            containerEl.append(timerIconEl)
            containerEl.append(timerEl)
            setInterval(loop, 500) // loop the function every 0.5 second
        }

        function disable() {
            if (enabled == false) {
                return
            }
            enabled = false

            console.log("disable");
            containerEl.style.display = 'none';

            while (containerEl.firstChild) {
                containerEl.removeChild(containerEl.firstChild)
            }
        }

        function update() {
            if (nextPixelCooldown == null) {
                disable()
            }
            else {
                enable()
                timerEl.innerText = nextPixelCooldown
                //document.title= `(${stack}/6) pxls.space`
            }
        }

        $(window).on('pxls:ack:place', (ev, x, y) => {
            lastPixelTime = new Date()
            if (enabled == false) {
                enable()
            }
        })

        /*$(window).on('pxls:ack:undo', (ev, x, y) => {
            if (enabled) {
                update()
            }
        })*/

    }

    $(window).one("pxls:user:loginState", (e, isLoggedIn) => {
        if (isLoggedIn) {
            requestAnimationFrame(() => {
                try {
                    start()
                } catch (ex) {
                    console.error(ex)
                }
            })
        }
    })

    window.addEventListener('load', function () {
        //document.getElementById('main-bubble').appendChild(containerEl)
        var mainDiv = document.getElementById('bubble-content');
        var div = mainDiv.getElementsByTagName('div')[4]; //fifth
        mainDiv.append(containerEl, div.nextSibling);
    })
})()
