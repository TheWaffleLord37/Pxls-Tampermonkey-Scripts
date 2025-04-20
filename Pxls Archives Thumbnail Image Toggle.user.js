// ==UserScript==
// @name         Pxls Archives Thumbnail Image Toggle
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Toggle between initial and final thumbnail images on https://archives.pxls.space/
// @author       ChatGPT
// @match        https://archives.pxls.space/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const buttonId = 'toggle-button';
    let showingFinal = false;

    function createButton() {
        if (document.getElementById(buttonId)) return;

        const button = document.createElement('button');
        button.id = buttonId;
        button.innerText = 'Show Final Images';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#444';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                // Find the closest .card container
                const card = img.closest('.card');
                if (card) {
                    const desc = card.querySelector('.description');
                    if (desc && desc.textContent.includes('(Active)')) {
                        return; // Skip this image (Since the final canvas state for the active canvas doesn't exist)
                    }
                }

                if (showingFinal) {
                    if (img.src.includes('-final.png')) {
                        img.src = img.src.replace('-final.png', '-initial.png');
                        img.alt = img.alt.replace('Final', 'Initial');
                    }
                } else {
                    if (img.src.includes('-initial.png')) {
                        img.src = img.src.replace('-initial.png', '-final.png');
                        img.alt = img.alt.replace('Initial', 'Final');
                    }
                }
            });

            showingFinal = !showingFinal;
            button.innerText = showingFinal ? 'Show Initial Images' : 'Show Final Images';
        });

    // Smooth transition and hover effect
    button.style.transition = 'background-color 0.2s ease';

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#666';
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#444';
    });

        document.body.appendChild(button);
    }

    function removeButton() {
        const existingButton = document.getElementById(buttonId);
        if (existingButton) {
            existingButton.remove();
        }
    }

    function checkPath() {
        if (location.pathname === '/') {
            createButton();
        } else {
            removeButton();
        }
    }

    // Initial check
    checkPath();

    // Observe URL changes (for SPAs or navigation without reload)
    const observer = new MutationObserver(checkPath);
    observer.observe(document.body, { childList: true, subtree: true });

    // Hook into pushState and replaceState
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    history.pushState = function (...args) {
        _pushState.apply(history, args);
        setTimeout(checkPath, 100);
    };

    history.replaceState = function (...args) {
        _replaceState.apply(history, args);
        setTimeout(checkPath, 100);
    };

    window.addEventListener('popstate', checkPath);
})();
