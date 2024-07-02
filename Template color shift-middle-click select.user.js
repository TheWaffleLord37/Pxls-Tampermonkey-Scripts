// ==UserScript==
// @name         Template color shift-middle-click select
// @version      0.2
// @description  When a template is loaded, holding shift and middle clicking a pixel on the template selects that color in the template instead of the color of the canvas.
// @author       Kris, ChatGPT, Kaz
// @match        https://pxls.space/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOESURBVDhPFZNZbFR1FIe//507W2frtNNl0oXajWlpy7QUBIkKVAWs4sKiBKQmakhpYkyIiT7ZuDz70ieV+CKvhmggBEOoW6JpVQpUtC12SrdpZ6adzkx75947c6+X53Nycs7vfJ84daTPlIQDuxMQGoYhoeY1JNlO7fZWKBRZnJ4Gm8A0DFxWozAEFHUKsg3bzs62YVPINDbXk1WydHTtItxQT3u0h2hvLw0tETJ5naqwn7tj4+w/eJStooSiqOjFAnK0txtNLdK7J8pXX//HE4f60TQdbyBIKODBMG1IhpPF2TGam6rIF/Nsa9uOszHM1NQsUmT3XnqePkpndDfkN2l9rI6alhbC28K4yh0YjhI6uyLkErNUBXyUlMg4PG7sQRddvT3Y3h06Mzzx5zhuh4ayNsfknd/57cdb1ITKuPTlCH1PHeD+2HXyK9NMzy/wzLGX6dj5OCUOH7UNDVY0enq4uS3CyMjnXBgcwMyuIdQ0S7F/HxUZvfYtG6l/ePX4CVRniAN9R/j04884+dpZtrbSiK7OJlMTblyuIuFSwZVLX5DPLqOZJrLTiZZRUUWWTUcdh/vfBkOlsrqC188OcOfXW4jx27fNk/1PUlFdxsbWFj9f/YbV+QkkK7xHAXqEgiQCyJUHKQRMTh8/hldyUXAanDj9FvIHH55h/6EdlLj8JFMbZJRN9DyUe73ILq8FR57M5joNFRkGhoY4/Gw3kl2g6ArVoRBSa90u5uZy3JuIcf6N82i5DAF/JWpRkLZ+nbYYAJn5+2N8cnGY1EqeuYcZ1I1aVCWDWJqfNpfXHuC1F7CreXLJFeyyE9MtMTUzTaQ5QsFaSWxZg5wuvDUhDHcV9ZV7SSQmkX4av0ttWTPZh8vk1hYpGiYOt8W1UqC7PQqSDafbhxQsxbRpFg9x9PWcdQakcjLi++8umzevXqF3RwPVFV78gWp+uHGD0mCQdGaNQDCArltkej3s2bcPBzr3/p5h7K8FXnnzAuL6tctmJpFiYvwXqsrd+Hw+mpqaKQ0ESKwl8fn9eDxeVlfiKKqG2yWxuBAnnjJ46dwgtqpwcLjdEqijs4vR0ZuWZQqpZJxEOmkJJ9hIbrC8tGDJoyPpGrMPYvwxGWPw4kesptYR7793zvSFqnHY4IXnn7Omx8jFY8QTCVw2O7JFoykVLL29zMRmCFQ28uKpd5iNL2Aqgv8BL6t6iusC390AAAAASUVORK5CYII=
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class Pxls {
        board = document.getElementById('board')
        boardContainer = document.getElementById('board-container')

        get cursorCoords() {
            let [x, y] = document.querySelectorAll('#coords-info > .coords')[0].textContent.match(/\d+/g).map(Number);
            return {'x': x, 'y': y}
        }

        async fetchPalette() {
            // gets palette as an array with rgb colors like [0,0,0] the indexes match with color select indexes
            if (!this._palette) {
                let response = await fetch(window.location.origin + "/info");
                let data = await response.json();

                this._palette = data.palette.map(color => {
                    const hexValue = color.value;
                    const r = parseInt(hexValue.substring(0, 2), 16);
                    const g = parseInt(hexValue.substring(2, 4), 16);
                    const b = parseInt(hexValue.substring(4, 6), 16);
                    return [r, g, b];
                });

            }
            return this._palette;
        }

        setSelectedColor(colorIndex) {
            const colorButton = document.querySelector(`#palette [data-idx="${colorIndex}"]`);
            if (colorButton) {
                colorButton.click();
                return true
            }
            else {
                console.warn("didn't find a matching palette button for index: ", colorIndex)
                return false


            }
        }

        get templateUrl() {
            return "https://pxls.space/cors/" + document.getElementById('template-url').value;
        }

        get templateWidth() {
            return parseInt(document.getElementById('template-width').value);
        }

        get templateLocation() {
            // x and y of the template's top left corner or it's offset for the board
            return {'x': parseInt(document.getElementById('template-coords-x').value),
                    'y': parseInt(document.getElementById('template-coords-y').value)};
        }

    }
    class Template {
        initialized = false;

        constructor(url, width, location) {
            this.url = url;
            this.width = width;
            this.location = location;
        }

        async initialize() {
            this.image = await this._downloadImage(this.url);
            this.scale = this.image.width / this.width;
            this.height = Math.floor(this.image.height / this.scale);
            this.data = await this._detemplatizeImage(this.image, this.scale, this.width, this.height);
            this.initialized = true;
        }

        async _downloadImage(url){
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = url;
            await img.decode(); // wait until it's ready
            return img
        }

        async _detemplatizeImage(image, scale, realWidth, realHeight) { // return the image data containing the image without any style applied (symbols, dots etc)
            // put the image into a canvas...
            const templateCanvas = document.createElement("canvas");
            const templateCtx = templateCanvas.getContext("2d");
            templateCanvas.width = image.width;
            templateCanvas.height = image.height;
            templateCtx.drawImage(image, 0, 0);
            // store the image. every 4 values are R G B A of every pixel in a row
            const templateData = templateCtx.getImageData(0, 0, templateCanvas.width, templateCanvas.height).data;

            if (image.width !== realWidth) { // image is in a style and must be converted

                const detemplatizedData = new Uint8Array(realWidth * realHeight * 4); // stores the end result

                // calcualate for each pixel of the actual image......
                for (let realY = 0; realY < realHeight; realY++) {
                    for (let realX = 0; realX < realWidth; realX++) {
                        // use scale to calculate the size of pixel 'blocks' so 3 times bigger is 3x3
                        let templateBlockStartX = Math.floor(realX * scale);
                        let templateBlockEndX = Math.floor(templateBlockStartX + scale);
                        let templateBlockStartY = Math.floor(realY * scale);
                        let templateBlockEndY = Math.floor(templateBlockStartY + scale);

                        const realDataOffset = (realWidth * realY + realX) * 4

                        let found = false; // true if color was found so no point in going further
                        // calculate from each of the template blocks......
                        for (let x = templateBlockStartX; x < templateBlockEndX; x++) {
                            for (let y = templateBlockStartY; y < templateBlockEndY; y++) {

                                const blockOffset = (y * image.width + x) * 4;

                                if (templateData[blockOffset + 3] !== 0) { // pixel in the block not transparent. means found the color for the pixel
                                    detemplatizedData[realDataOffset] = templateData[blockOffset];
                                    detemplatizedData[realDataOffset + 1] = templateData[blockOffset + 1];
                                    detemplatizedData[realDataOffset + 2] = templateData[blockOffset + 2];
                                    detemplatizedData[realDataOffset + 3] = 255

                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                break;
                            }
                        }
                        // all transparent so actually transparent, can do nothing since its a transparent pixel by default (all 0)


                    }
                }
                return (detemplatizedData); // W

            }
            else { // the image is already fine as the width matches
                return (templateData);
            }
        }

        getPixel(x, y) {
            let offset = (y * template.width + x) * 4;
            let data = this.data
            return [this.data[offset], this.data[offset + 1], this.data[offset + 2], this.data[offset + 3]];
        }

        get isCurrent() {
            const reg = new RegExp(document.getElementById('template-url').value)
            return reg.test(this.url)
        }

    }


    function findColorIndex(color, palette) {
        for (let i = 0; i < palette.length; i++) {
            // with current pxls palette the closest colors are dark grey and dark chocolate and would mess up with threshold around 38
            if (areColorsSimilar(color, palette[i], 20)) {
                return i;
            }
        }
        console.warn("didnt find the index for color ", color)
        return null;
    }

    function areColorsSimilar(color1, color2, threshold=0) {

        let redDiff = Math.abs(color1[0] - color2[0]);
        let greenDiff = Math.abs(color1[1] - color2[1]);
        let blueDiff = Math.abs(color1[2] - color2[2]);
        let totalDiff = redDiff + greenDiff + blueDiff

        return totalDiff <= threshold

    }

    let pxls = null
    let template = null

    async function handleShiftMiddleClick(event) {
        if (event.shiftKey && (event.which === 2 || event.button === 1)) { // Shift + Middle-click event
            if (!template || !template.isCurrent) {
                console.time('Got template in')
                template = new Template(pxls.templateUrl, pxls.templateWidth, pxls.templateLocation)
                await template.initialize()
                console.timeEnd('Got template in')
            }

            let targetCoords = pxls.cursorCoords
            let pixel = await template.getPixel(targetCoords.x - template.location.x, targetCoords.y - template.location.y)

            if (!pixel) {
                return;
            }

            pxls.setSelectedColor(findColorIndex(pixel, await pxls.fetchPalette()))
        }
    }

    let waitForLoad = setInterval(function () {
        if (App) {
            console.log('Template color pick')
            clearInterval(waitForLoad)
            pxls = new Pxls()

            // Replace 'pointerup' with 'auxclick' to listen for middle-click event
            // And add a new event listener for 'keydown' to handle Shift key press.
            pxls.board.addEventListener('auxclick', handleShiftMiddleClick)
            window.addEventListener('keydown', function(event) {
                if (event.key === 'Shift') {
                    pxls.board.addEventListener('auxclick', handleShiftMiddleClick)
                }
            });
            window.addEventListener('keyup', function(event) {
                if (event.key === 'Shift') {
                    pxls.board.removeEventListener('auxclick', handleShiftMiddleClick)
                }
            });
        }
    }, 1000)
})();
