// ==UserScript==
// @name         Pxls Transparent Reticule
// @version      0.3.4
// @description  Makes the reticule transparent so it's easier to see templates.
// @author       LittleEndu
// @match        https://pxls.space/*
// @icon         https://pxls.space/favicon.ico
// @grant        none
// ==/UserScript==

window.addEventListener('load', () => {
    const reticule = document.getElementById('reticule');
    const ttp = (1/3)*100
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            if ((x + y) % 2 === 1) {
                let square = document.createElement('div');
                square.style.width = `${ttp}%`
                square.style.height = `${ttp}%`
                square.style.position = 'absolute';
                square.style.top = `${ttp * y}%`
                square.style.left = `${ttp * x}%`
                square.style.pointerEvents = 'none';
                reticule.appendChild(square)
            }
        }
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mut) => {
            if (mut.type === 'attributes' && mut.attributeName === 'style') {
                let color = reticule.style.backgroundColor;
                if (color) {
                    reticule.style.backgroundColor = null;
                    reticule.style.outline = `3px solid ${color}`
                    reticule.style.outlineOffset = '-5px'
                    for (let s = 0; s < reticule.children.length; s++) {
                        let square = reticule.children[s];
                        square.style.backgroundColor = color
                    }

                }
            }
        })
    })
    observer.observe(document.documentElement, { attributes: true })
})
